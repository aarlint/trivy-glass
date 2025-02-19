import { KubeConfig, CustomObjectsApi } from '@kubernetes/client-node';

interface CacheEntry {
  data: any;
  timestamp: number;
}

const cache: Record<string, CacheEntry> = {};
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function loadReports(crdPlural: string) {
  const now = Date.now();
  if (cache[crdPlural] && (now - cache[crdPlural].timestamp < CACHE_DURATION)) {
    console.log(`Using cache for ${crdPlural}`);
    return cache[crdPlural].data;
  }

  console.log(`Renewing cache for ${crdPlural}`);
  const kc = new KubeConfig();
  let clusterName = 'Unknown Cluster';

  if (process.env.KUBERNETES_SERVICE_HOST && process.env.KUBERNETES_SERVICE_PORT) {
    kc.loadFromCluster();
    clusterName = kc.getCurrentCluster()?.name || clusterName;
  } else {
    kc.loadFromDefault();
    clusterName = kc.getCurrentCluster()?.name || clusterName;
  }

  const customObjectsApi = kc.makeApiClient(CustomObjectsApi);
  const CRD_GROUP = 'aquasecurity.github.io';
  const CRD_VERSION = 'v1alpha1';

  try {
    const result = await customObjectsApi.listCustomObjectForAllNamespaces({
      group: CRD_GROUP,
      version: CRD_VERSION,
      plural: crdPlural
    });
    const items = (result as any).items || [];
    const data = { reports: items, clusterName };
    cache[crdPlural] = { data, timestamp: now };
    return data;
  } catch (err: any) {
    console.log(`Error fetching ${crdPlural}: ${err.message}`);
    const data = { reports: [], error: err.message, clusterName };
    cache[crdPlural] = { data, timestamp: now };
    return data;
  }
}
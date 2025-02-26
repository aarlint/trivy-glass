<script lang="ts">
	import {
		MegaMenu,
		Navbar,
		NavBrand,
		NavUl,
		NavLi,
		uiHelpers,
		NavHamburger,
	} from 'svelte-5-ui-lib';
	import { page } from '$app/stores';
	let activeUrl = $state($page.url.pathname);

	let nav = uiHelpers();
	let navStatus = $state(false);
	let toggleNav = nav.toggle;



	let menu = [
		{ name: 'About us', href: '/about' },
		{ name: 'Blog', href: '/blog' },
		{ name: 'Contact us', href: '/contact' },
		{ name: 'Library', href: '/library' },
		{ name: 'Newsletter', href: '/news' },
		{ name: 'Support Center', href: '/support' },
		{ name: 'Resources', href: '/resource' },
		{ name: 'Playground', href: '/play' },
		{ name: 'Terms', href: '/terms' },
		{ name: 'Pro Version', href: '/pro' },
		{ name: 'License', href: '/license' }
	];
	let mega = uiHelpers();
	let megaStatus = $state(false);

	$effect(() => {
		navStatus = nav.isOpen;
		megaStatus = mega.isOpen;
	});
	import { Darkmode } from 'svelte-5-ui-lib';
	$effect(() => {
		
		navStatus = nav.isOpen;
		activeUrl = $page.url.pathname;
	});
</script>

<div class="h-16">
	<Navbar {navStatus} hamburgerMenu={false}>
		{#snippet brand()}
			<NavBrand siteName="Trivy Glass">
				<img width="30" src="/trivyglass.png" alt="svelte icon" />
			</NavBrand>
		{/snippet}
		{#snippet navSlotBlock()}
			<div class="flex items-center space-x-1 md:order-2">
				<Darkmode />

				<NavHamburger {toggleNav} />
			</div>
		{/snippet}
		<NavUl class="order-1" {activeUrl}>
			<NavLi href="/">.</NavLi>
		</NavUl>
	</Navbar>
	<div class="relative">
		<MegaMenu
			items={menu}
			dropdownStatus={megaStatus}
			class="absolute -top-[20px] left-[300px] w-[400px]"
		>
			{#snippet children(prop)}
				<a href={prop.item.href} class="hover:text-primary-600 dark:hover:text-primary-500"
					>{prop.item.name}</a
				>
			{/snippet}
		</MegaMenu>
	</div>
</div>

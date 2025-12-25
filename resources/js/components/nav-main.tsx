import {
    SidebarGroup,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { resolveUrl } from '@/lib/utils';
import { type NavGroup, } from '@/types';
import { Link, usePage } from '@inertiajs/react';

export function NavMain({ items = [] }: { items: NavGroup[] } ) {
    const page = usePage();
    return (
        <>
            {items.map((item) => (
                <SidebarGroup key={item.title} className="px-2 py-0">
                    <SidebarGroupLabel>{item.title}</SidebarGroupLabel>
                    <SidebarMenu>
                            {item.items?.map((i) => (
                                <SidebarMenuItem key={i.title}>
                                    <SidebarMenuButton
                                        asChild
                                        isActive={page.url.startsWith(
                                            resolveUrl(i.href),
                                        )}
                                        tooltip={{ children: i.title }}
                                    >
                                        <Link href={i.href} prefetch>
                                            {i.icon && <i.icon />}
                                            <span>{i.title}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                    </SidebarMenu>
                </SidebarGroup>
            ))}
        </>
    );
}

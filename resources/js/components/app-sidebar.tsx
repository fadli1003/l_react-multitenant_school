import AppLogo from '@/components/app-logo';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import { type NavGroup } from '@/types';
import { Link } from '@inertiajs/react';
import {
    Building2,
    ClipboardList,
    GraduationCap,
    LayoutGrid,
    LibraryBig,
    School,
    UserRoundPlus,
    Users,
    UsersRound,
} from 'lucide-react';
import { route } from 'ziggy-js';

const mainNavItems: NavGroup[] = [
    {
        title: 'Platform',
        items: [
            {
                title: 'Dashboard',
                href: dashboard(),
                icon: LayoutGrid,
            },
            {
                title: 'Laporan',
                href: dashboard(),
                icon: ClipboardList,
            },
        ],
    },
    {
        title: 'Tenant',
        items: [
            {
                title: 'School Information',
                href: route('tenant.index'),
                icon: School,
            },
            {
                title:'Add New Tenant',
                href: route('tenant.create'),
                icon: Building2,
            }
        ]
    },
    {
        title: 'Course',
        items: [
            {
                title: 'Course Information',
                href: route('course.index'),
                icon: GraduationCap,
            },
            {
                title: 'Add New Course',
                href: route('course.create'),
                icon: LibraryBig,
            },
        ],
    },
    {
        title: 'Teacher',
        items: [
            {
                title: 'Teachers Information',
                href: route('teacher.index'),
                icon: Users
            },
            {
                title: 'Add Teacher',
                href: route('teacher.create'),
                icon: UserRoundPlus,
            },
        ],
    },
    {
        title: 'Student',
        items: [
            {
                title: 'Students Information',
                href: route('student.index'),
                icon: UsersRound,
            },
            {
                title: "Add New Studant's",
                href: route('student.create'),
                icon: UserRoundPlus,
            },
        ],
    },
    {
        title: 'User',
        items: [
            {
                title: 'Users Information',
                href: route('pengguna.index'),
                icon: Users,
            },
            {
                title: 'Create New User',
                href: route('pengguna.create'),
                icon: UserRoundPlus,
            }
        ],
    },
    {
        title: 'Enrollment',
        items: [
            {
                title: 'Enrollment Data',
                href: route('enrollment.index'),
                icon: Users,
            },
            {
                title: 'Create New Enrollment',
                href: route('enrollment.create'),
                icon: UserRoundPlus,
            }
        ],
    },
];

export function AppSidebar() {
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>
            <SidebarFooter>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

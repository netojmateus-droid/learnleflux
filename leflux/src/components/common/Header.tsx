import { NavLink } from 'react-router-dom';
import { AmbientToggle } from './AmbientToggle';
import { cn } from '@/lib/utils';
import { useI18n } from '@/services/i18n';

export function Header() {
    const { locale } = useI18n();
    const navItems = [
        { to: '/', label: locale.nav.library, exact: true },
        { to: '/import', label: locale.nav.import },
        { to: '/vocabulary', label: locale.nav.vocabulary },
        { to: '/review', label: locale.nav.review },
        { to: '/texts', label: locale.nav.stories },
        { to: '/account', label: locale.nav.account },
    ];

    return (
        <header className="sticky top-0 z-30 hidden border-b border-white/5 bg-dark-base/80 backdrop-blur-xl lg:block">
            <div className="mx-auto flex h-20 w-full max-w-6xl items-center justify-between px-8">
                <NavLink to="/" className="font-display text-2xl font-semibold text-text-primary">
                    LeFlux
                </NavLink>

                <nav className="flex items-center gap-1 text-sm">
                    {navItems.map(({ to, label, exact }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={Boolean(exact)}
                            className={({ isActive }) =>
                                cn(
                                    'rounded-2xl px-4 py-2 text-text-secondary transition hover:bg-white/5 hover:text-text-primary',
                                    isActive && 'bg-white/10 text-text-primary'
                                )
                            }
                        >
                            {label}
                        </NavLink>
                    ))}
                </nav>

                <div className="flex items-center gap-3">
                    <AmbientToggle />
                </div>
            </div>
        </header>
    );
}

export default Header;
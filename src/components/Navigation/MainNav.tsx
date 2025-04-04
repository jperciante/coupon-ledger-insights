
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle
} from "@/components/ui/navigation-menu";
import { cn } from '@/lib/utils';
import { CreditCard, BarChart2, Receipt } from 'lucide-react';

const MainNav: React.FC = () => {
  const location = useLocation();
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <NavigationMenu className="max-w-full w-full justify-start">
      <NavigationMenuList className="gap-2">
        <NavigationMenuItem>
          <Link to="/">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive('/') && 'bg-accent text-accent-foreground',
                'flex items-center gap-2'
              )}
            >
              <BarChart2 className="h-4 w-4" />
              <span>Dashboard</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/credit-card-coupons">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive('/credit-card-coupons') && 'bg-accent text-accent-foreground',
                'flex items-center gap-2'
              )}
            >
              <CreditCard className="h-4 w-4" />
              <span>Credit Card Coupons</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        
        <NavigationMenuItem>
          <Link to="/sales-coupons">
            <NavigationMenuLink 
              className={cn(
                navigationMenuTriggerStyle(),
                isActive('/sales-coupons') && 'bg-accent text-accent-foreground',
                'flex items-center gap-2'
              )}
            >
              <Receipt className="h-4 w-4" />
              <span>Sales Coupons</span>
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
};

export default MainNav;

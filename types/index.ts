import { Icons } from '@/components/icons';

export interface NavItem {
  title: string;
  href?: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
  label?: string;
  description?: string;
  children?: NavItem[];
}

export interface NavItemWithChildren extends NavItem {
  items: NavItemWithChildren[];
}

export interface NavItemWithOptionalChildren extends NavItem {
  items?: NavItemWithChildren[];
}

export interface FooterItem {
  title: string;
  items: {
    title: string;
    href: string;
    external?: boolean;
  }[];
}

export type MainNavItem = NavItemWithOptionalChildren;

export type SidebarNavItem = NavItemWithChildren;


export enum PaymentTypes {
  CashApp = 'CashApp',
  PayPal = 'PayPal',
  Zelle = 'Zelle',
  Venmo = 'Venmo',
  Bitcoin = 'Bitcoin',
}

export const ErrorCodes = {
  phoneNotVerified: 'PHONE_NUMBER_NOT_VERIFIED',
  emailNotVerified: 'EMAIL_NOT_VERIFIED',
}
"use client"

import SidebarMain from "@/components/sidebar-main"

import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"

export default function Page({children}: {children: React.ReactNode}) {
  return (
    <SidebarProvider>
      <SidebarMain />
      <SidebarInset>
        {children}
      </SidebarInset>
    </SidebarProvider>
  )
}


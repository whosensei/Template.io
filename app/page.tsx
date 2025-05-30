"use client";

import { PageLayout } from "@/components/page-layout"
import { TemplateManagerHeader } from "@/components/template-manager-header"
import { TemplateManagerContainer } from "@/components/template-manager-container"

export default function Home() {
  return (
    <PageLayout>
      <TemplateManagerHeader />
      <TemplateManagerContainer />
    </PageLayout>
  )
}

"use client";

import Layout from "../../components/dashboard/layout"
import CardDemo1 from "@/components/cards-demo-1"
import CardDemo2 from "@/components/cards-demo-2"
import CardDemo3 from "@/components/cards-demo-3"

export default function Dashboard() {
  return (
    <div data-theme="dark">
      <Layout>
        <div className="flex flex-row justify-center items-stretch gap-6 mx-auto max-w-6xl mt-20">
          <div className="flex-1 w-full max-w-sm h-[400px]">
            <CardDemo2 />
          </div>
          <div className="flex-1 w-full max-w-sm h-[400px]">
            <CardDemo3 />
          </div>
          <div className="flex-1 w-full max-w-sm h-[400px]">
            <CardDemo1 />
          </div>
        </div>
      </Layout>
    </div>
  )
}

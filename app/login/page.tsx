import type { Metadata } from "next";
import { AdminLogin } from "@/components/AdminLogin";
export const metadata:Metadata={title:"Private notebook",robots:{index:false,follow:false}};
export default function LoginPage(){return <AdminLogin/>}

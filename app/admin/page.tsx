import StatCard from "@/components/StatCard";
import Image from "next/image";
import Link from "next/link";
import React from "react";

const Admin = () => {
  return (
    <div className="mx-auto flex max-w-7xl flex-col space-y-14">
      <header className="admin-header">
        <Link href="/" className="cursor-pointer">
          <Image
            src="/assets/icons/logo-full.svg"
            width={162}
            height={32}
            alt="logo"
            className="h-8 w-fit"
          />
        </Link>
        <p className="text-16-semibold">Admin Dashboard</p>
      </header>
      <main className="admin-main">
        <section className="w-full space-y-4">
          <h1 className="header">Welcome Back, Admin</h1>
          <p className="text-dark-700">
            Manage New and Existing Appointments Here.
          </p>
        </section>
        <section className="admin-stat">
          <StatCard 
            type='appointments'
            count={5}
            label='Scheduled Appointments'
            icon='/assets/icons/appointments.svg'
          />
          <StatCard 
            type='pending'
            count={14}
            label='Pending Appointments'
            icon='/assets/icons/pending.svg'
          />
          <StatCard 
            type='cancelled'
            count={3}
            label='Cancelled Appointments'
            icon='/assets/icons/cancelled.svg'
          />
        </section>
      </main>
    </div>
  );
};

export default Admin;

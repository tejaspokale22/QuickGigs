"use client";
import React from "react";

// Static Page Component (For illustration purposes)
const Page: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Dashboard</h1>

      {/* Home Section */}
      <section className="mb-6">
        <h2 className="text-xl font-medium">Home</h2>
        <p>
          Welcome to the home page! Here you can see the overview of your
          profile and activities.
        </p>
      </section>

      {/* Profile Section */}
      <section className="mb-6">
        <h2 className="text-xl font-medium">Profile</h2>
        <p>
          This is your profile section where you can view and edit your personal
          details.
        </p>
      </section>

      {/* Posted Gigs Section */}
      <section className="mb-6">
        <h2 className="text-xl font-medium">Posted Gigs</h2>
        <p>
          This section contains a list of gigs you have posted. You can manage
          and edit them here.
        </p>
      </section>

      {/* Applied Gigs Section */}
      <section className="mb-6">
        <h2 className="text-xl font-medium">Applied Gigs</h2>
        <p>
          Here you will find a list of gigs you have applied to. Track your
          applications and their status.
        </p>
      </section>

      {/* Completed Gigs Section */}
      <section className="mb-6">
        <h2 className="text-xl font-medium">Completed Gigs</h2>
        <p>
          This section shows the gigs you have successfully completed. Review
          and manage your completed work.
        </p>
      </section>

      {/* Assigned Gigs Section */}
      <section className="mb-6">
        <h2 className="text-xl font-medium">Assigned Gigs</h2>
        <p>
          These are the gigs assigned to you. Track your progress and manage
          tasks here.
        </p>
      </section>

      {/* Wallet Section */}
      <section className="mb-6">
        <h2 className="text-xl font-medium">Wallet</h2>
        <p>
          Here you can view your earnings, manage your balance, and perform.
        </p>
      </section>
    </div>
  );
};

export default Page;

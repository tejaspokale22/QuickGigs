"use client";

import { useEffect, useState } from "react";
import { fetchGigById } from "@/app/utils/actions/gigActions";
import { useParams } from "next/navigation";
import { Gig } from "@/app/utils/types";

export default function GigDetailsPage() {
  const { slug } = useParams() as { slug: string }; // Ensure slug is typed
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch gig details on mount or when slug changes
  useEffect(() => {
    if (!slug) {
      setError("Invalid slug. Cannot fetch gig details.");
      setLoading(false);
      return;
    }

    const fetchGig = async () => {
      try {
        setLoading(true);
        const fetchedGig = await fetchGigById(slug);

        if (fetchedGig) {
          setGig(fetchedGig);
        } else {
          setError("Gig not found.");
        }
      } catch (err) {
        console.error("Error fetching gig details:", err);
        setError("Failed to fetch gig details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchGig();
  }, [slug]);

  // Render loading, error, or gig details
  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Gig Details</h1>

      {loading && <p>Loading gig details...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}
      {gig && <GigDetails gig={gig} />}
    </div>
  );
}

type GigDetailsProps = {
  gig: Gig;
};

// Extracted reusable component for displaying gig details
function GigDetails({ gig }: GigDetailsProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <DetailRow label="ID" value={gig.id} />
      <DetailRow label="Title" value={gig.title} />
      <DetailRow label="Description" value={gig.description} />
      <DetailRow label="Skills Required" value={gig.skillsRequired.join(", ")} />
      <DetailRow label="Price" value={`$${gig.price}`} />
      <DetailRow
        label="Deadline"
        value={gig.deadline.toDate().toLocaleString()}
      />
      <DetailRow label="Status" value={gig.status} />
      <DetailRow label="Client ID" value={gig.clientId} />
      <DetailRow
        label="Created At"
        value={gig.createdAt.toDate().toLocaleString()}
      />
    </div>
  );
}

// Reusable component for displaying a label-value pair
type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <p className="mb-2">
      <strong>{label}:</strong> {value}
    </p>
  );
}

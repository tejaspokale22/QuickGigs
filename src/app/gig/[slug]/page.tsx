"use client";

import { useEffect, useState } from "react";
import { fetchGigById } from "@/app/utils/actions/gigActions";
import { useParams } from "next/navigation";
import { Gig } from "@/app/utils/types";

export default function GigDetailsPage() {
  const { slug } = useParams() as { slug: string };
  const [gig, setGig] = useState<Gig | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

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

function GigDetails({ gig }: GigDetailsProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-6">
      <DetailRow label="ID" value={gig.id} />
      <DetailRow label="Title" value={gig.title} />
      <DetailRow label="Description" value={gig.description} />
      <DetailRow label="Skills Required" value={gig.skillsRequired.join(", ")} />
      <DetailRow label="Price" value={`$${gig.price}`} />
      <DetailRow label="Deadline" value={gig.deadline.toDate().toLocaleString()} />
      <DetailRow label="Status" value={gig.status} />
      <DetailRow label="Client ID" value={gig.clientId} />
      <DetailRow label="Created At" value={gig.createdAt.toDate().toLocaleString()} />

      {/* 🔹 Attachments Section */}
      {gig.attachments && gig.attachments.length > 0 && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-2">Attachments</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {gig.attachments.map((attachment, index) => (
              <AttachmentPreview key={index} attachment={attachment} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Reusable component for label-value pair
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

// 🔹 Component to Preview Attachments
type AttachmentProps = {
  attachment: { fileUrl: string; fileName: string; fileType: string };
};

function AttachmentPreview({ attachment }: AttachmentProps) {
  const isImage = attachment.fileType.startsWith("image");

  return (
    <div className="p-3 border rounded-lg shadow-sm">
      {isImage ? (
        <img
          src={attachment.fileUrl}
          alt={attachment.fileName}
          className="w-full h-40 object-cover rounded-md"
        />
      ) : (
        <p className="truncate">{attachment.fileName}</p>
      )}
      <a
        href={attachment.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="text-blue-600 hover:underline block mt-1"
      >
        View / Download
      </a>
    </div>
  );
}

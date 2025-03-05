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
    <div className="pt-20 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Gig Details</h1>

      {loading && <p className="text-gray-600">Loading gig details...</p>}
      {error && <p className="text-red-500">{error}</p>}
      {gig && <GigDetails gig={gig} />}
    </div>
  );
}

type GigDetailsProps = {
  gig: Gig;
};

function GigDetails({ gig }: GigDetailsProps) {
  return (
    <div className="bg-white shadow-lg rounded-lg p-10 border border-gray-200">
      {/* ✅ Title Section */}
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{gig.title}</h2>
      <p className="text-gray-600 mb-4">{gig.description}</p>

      {/* ✅ Gig Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <DetailRow label="Posted Date" value={gig.createdAt.toDate().toLocaleDateString()} />
        <DetailRow label="Deadline" value={gig.deadline.toDate().toLocaleString()} />
        <DetailRow label="Payout" value={`$${gig.price}`} />
      </div>

      {/* ✅ Skills Section */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800">Skills Required</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {gig.skillsRequired.map((skill, index) => (
            <span
              key={index}
              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm font-medium rounded-full"
            >
              {skill}
            </span>
          ))}
        </div>
      </div>

      {/* ✅ Attachments Section */}
      {gig.attachments && gig.attachments.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Attachments</h3>
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

// ✅ Reusable component for label-value pair
type DetailRowProps = {
  label: string;
  value: string;
};

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex justify-between">
      <span className="text-gray-600 font-medium">{label}:</span>
      <span className="text-gray-900">{value}</span>
    </div>
  );
}

// ✅ Component to Preview Attachments
type AttachmentProps = {
  attachment: { fileUrl: string; fileName: string; fileType: string };
};

function AttachmentPreview({ attachment }: AttachmentProps) {
  const isImage = attachment.fileType.startsWith("image");

  return (
    <div className="p-3 border rounded-lg shadow-sm bg-gray-50">
      {isImage ? (
        <img
          src={attachment.fileUrl}
          alt={attachment.fileName}
          className="w-full h-40 object-cover rounded-md"
        />
      ) : (
        <p className="truncate text-gray-700">{attachment.fileName}</p>
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


"use client"
import { AppHero } from '@/components/app-hero'
import { useState } from 'react';
import { useCreateTokenProgram } from '../create_token/create_token-data-access';



// const links: { label: string; href: string }[] = [
//   { label: 'Solana Docs', href: 'https://docs.solana.com/' },
//   { label: 'Solana Faucet', href: 'https://faucet.solana.com/' },
//   { label: 'Solana Cookbook', href: 'https://solana.com/developers/cookbook/' },
//   { label: 'Solana Stack Overflow', href: 'https://solana.stackexchange.com/' },
//   { label: 'Solana Developers GitHub', href: 'https://github.com/solana-developers/' },
// ]







export function DashboardFeature() {

  const { createTokenMutation } = useCreateTokenProgram(); 
   const [formData, setFormData] = useState({
    name: "",
    ticker: "",
    metadataFileUri: "",
    image: null as File | null,
  });

   const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
   e.preventDefault();
      try {
         await createTokenMutation.mutateAsync(formData);
         console.log("✅ Token creation initiated successfully!");
      } catch (error) {
         console.error("Failed to submit token creation:", error);
      }
};

  return (
    <div>
      <AppHero title="Create Your Token" subtitle="Your very own tokens here" />
      <div className="max-w-md mx-auto mt-8 p-4 border rounded-lg shadow">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            placeholder="Solana"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Ticker</label>
          <input
            type="text"
            name="ticker"
            placeholder="SOL"
            value={formData.ticker}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Metadata File uri</label>
          <textarea
            name="metadataFileUri"
            placeholder="metadata file uri."
            value={formData.metadataFileUri}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Upload Image</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Create Token
        </button>
      </form>
    </div>
    </div>
  )
}

"use client";

import { useActionState } from "react";
import type { PropertyFormState } from "@/app/actions/admin";
import ImageUploader from "./ImageUploader";

type PropertyDefaults = {
  id?: string;
  title: string;
  type: string;
  purpose: string;
  city: string;
  country: string;
  pricePerNight: number;
  description: string;
  amenities: string;
  images: string;
  maxGuests: number;
  bedrooms: number;
  rating: number;
  isAvailable: boolean;
};

type PropertyFormProps = {
  action: (state: PropertyFormState, formData: FormData) => Promise<PropertyFormState>;
  defaults?: PropertyDefaults;
  submitLabel: string;
};

const emptyDefaults: PropertyDefaults = {
  title: "",
  type: "HOUSE",
  purpose: "VACATION",
  city: "",
  country: "",
  pricePerNight: 100,
  description: "",
  amenities: "",
  images: "",
  maxGuests: 2,
  bedrooms: 1,
  rating: 4.5,
  isAvailable: true,
};

export default function PropertyForm({ action, defaults, submitLabel }: PropertyFormProps) {
  const values = defaults ?? emptyDefaults;
  const [state, formAction, pending] = useActionState<PropertyFormState, FormData>(
    action,
    undefined
  );

  return (
    <form action={formAction} className="space-y-5">
      {values.id && <input type="hidden" name="id" value={values.id} />}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-slate-700">
          Title
        </label>
        <input
          id="title"
          name="title"
          type="text"
          required
          defaultValue={values.title}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="block text-sm font-medium text-slate-700">
            City
          </label>
          <input
            id="city"
            name="city"
            type="text"
            required
            defaultValue={values.city}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="country" className="block text-sm font-medium text-slate-700">
            Country
          </label>
          <input
            id="country"
            name="country"
            type="text"
            required
            defaultValue={values.country}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-slate-700">
            Stay type
          </label>
          <select
            id="type"
            name="type"
            defaultValue={values.type}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="HOTEL">Hotel</option>
            <option value="HOUSE">House</option>
          </select>
        </div>
        <div>
          <label htmlFor="purpose" className="block text-sm font-medium text-slate-700">
            Trip type
          </label>
          <select
            id="purpose"
            name="purpose"
            defaultValue={values.purpose}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="VACATION">Vacation</option>
            <option value="WORK">Work</option>
            <option value="BOTH">Both</option>
          </select>
        </div>
        <div>
          <label htmlFor="pricePerNight" className="block text-sm font-medium text-slate-700">
            Price / night ($)
          </label>
          <input
            id="pricePerNight"
            name="pricePerNight"
            type="number"
            min={1}
            step="1"
            required
            defaultValue={values.pricePerNight}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label htmlFor="maxGuests" className="block text-sm font-medium text-slate-700">
            Max guests
          </label>
          <input
            id="maxGuests"
            name="maxGuests"
            type="number"
            min={1}
            required
            defaultValue={values.maxGuests}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="bedrooms" className="block text-sm font-medium text-slate-700">
            Bedrooms
          </label>
          <input
            id="bedrooms"
            name="bedrooms"
            type="number"
            min={0}
            required
            defaultValue={values.bedrooms}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <label htmlFor="rating" className="block text-sm font-medium text-slate-700">
            Rating (0-5)
          </label>
          <input
            id="rating"
            name="rating"
            type="number"
            min={0}
            max={5}
            step="0.1"
            required
            defaultValue={values.rating}
            className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            name="isAvailable"
            defaultChecked={values.isAvailable}
            className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Available for booking
        </label>
        <p className="mt-1 text-xs text-slate-500">
          Unchecking this hides the listing from search and blocks new bookings.
        </p>
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-slate-700">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          rows={4}
          required
          defaultValue={values.description}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>

      <div>
        <label htmlFor="amenities" className="block text-sm font-medium text-slate-700">
          Amenities
        </label>
        <input
          id="amenities"
          name="amenities"
          type="text"
          required
          placeholder="Pool, WiFi, Kitchen, Free parking"
          defaultValue={values.amenities}
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <p className="mt-1 text-xs text-slate-500">Comma-separated.</p>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700">Photos</label>
        <div className="mt-1">
          <ImageUploader name="images" defaultImages={values.images} />
        </div>
      </div>

      {state?.error && (
        <p className="text-sm text-red-600" role="alert">
          {state.error}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-60"
      >
        {pending ? "Saving…" : submitLabel}
      </button>
    </form>
  );
}

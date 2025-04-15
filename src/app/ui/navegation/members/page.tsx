'use client';
// added some comments
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { FaStar } from 'react-icons/fa';

type Users = {
  id: number;
  first_name: string;
  last_name: string;
  email: string; 
}

const images = [{imagesrc: "/images/p1.jpg"}, {imagesrc: "/images/p2.jpg"}, {imagesrc: "/images/p3.jpg"}];
const MemberPage = () => {
  const [profiles, setProfiles] = useState<Users[]>([]);
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);

  const fetchUsers = async () => {
    const res = await fetch('/api/usersP');
    const data = await res.json();
    console.log(data);
    if (Array.isArray(data)) {
      setProfiles(data);
    } else {
      console.error("Error: Data is not an array", data);
    }
  };
  
  useEffect(() => {
    fetchUsers(); // Fetch products when the component mounts
  }, []);

  return (
    <div className="flex justify-center mt-24">
      <div className="pb-8 pt-8 w-2/5 bg-yellow-300 rounded-lg">
      {/* eslint-disable-next-line react/no-unescaped-entities */}
        <h1 className="text-white text-3xl font-bold text-center mb-6 mt-6">Sellers' Profiles</h1>
        <div>
          {profiles.map((profile, image) => (
            <div key={profile.id}>
              <div>
                <Image
                  src={images[image % images.length]?.imagesrc || "/images/default-profile.jpg"} // addedon tuesday
                  alt="Person"
                  width={100}
                  height={80}
                  className="m-auto"
                />
              </div>
              
              <h3 className="text-center text-white">{profile.first_name} {profile.last_name}</h3>
              <h4 className="text-center text-white">{profile.email}</h4>
              <div className="border-b-4 border-indigo-500 w-2/5 m-auto mb-8"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="ml-8 w-2/5 bg-gray-100 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-4 text-center">Make Review</h2>
        <form>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-bold mb-2">Name</label>
            <input
              type="text"
              id="name"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Your Name"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-bold mb-2">Email</label>
            <input
              type="email"
              id="email"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              placeholder="Your Email"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="rating" className="block text-gray-700 font-bold mb-2">Rating</label>
            <div className="flex justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  size={30}
                  className={`cursor-pointer transition-colors duration-200 ${
                    star <= (hover || rating) ? 'text-yellow-500' : 'text-gray-300'
                  }`}
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                />
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label htmlFor="review" className="block text-gray-700 font-bold mb-2">Review</label>
            <textarea
              id="review"
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
              rows={4}
              placeholder="Write your review here..."
            ></textarea>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition duration-300"
          >
            Submit Review
          </button>
        </form>
      </div>
    </div>
  );
};

export default MemberPage;
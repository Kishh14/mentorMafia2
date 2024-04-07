import Header from "./Header";
import Hero from "./Hero";
import Footer from "./Footer";
import Account from "./Account";
import { useState } from "react";
import ChatWindow from "./ChatWindow";

const Home = ({ isLoggedIn, setIsLoggedIn, profilePicture, userName, profilePictureExist, mentorsList, setMentorUserId }) => {


  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} profilePictureExist={profilePictureExist}></Header>
      <Hero isLoggedIn={isLoggedIn} mentorsList={mentorsList} setMentorUserId={setMentorUserId}></Hero>

      <section className="video-section py-32 px-48 text-center">
        <h3 className="text-3xl font-bold">Level Up Your Game: Find Your Perfect Mentor</h3>
        <p className="my-6 text-gray-500 text-1xl px-52">Our curated network of accomplished mentors across diverse fields offers tailored support, actionable advice, and the inspiration you need to reach new heights in your career.</p>
        <div className="video-container rounded-3xl bg-gray-200 p-10 mt-10">
          <video src="/assets/videos/v1.mp4" className="rounded-3xl shadow" autoPlay muted loop></video>
        </div>
      </section>

      <section className="achivement-section py-32 px-36">
        <h3 className="text-center font-bold text-4xl mb-16">A Platform with Performance</h3>
        <div className="flex justify-center gap-14">
          <div className="achievement-card bg-white bg-opacity-20 text-center p-16 rounded-lg backdrop-blur-sm">
            <span className="text-lg text-gray-600">We Aim to Build</span>
            <h2 className="font-bold text-4xl text-purple-800 my-3">1M</h2>
            <p className="text-gray-800 text-xl">Connections</p>
          </div>
          <div className="achievement-card bg-white bg-opacity-20 text-center p-16 rounded-lg backdrop-blur-sm">
            <span className="text-lg text-gray-600">Improved career prospects for</span>
            <h2 className="font-bold text-4xl text-purple-800 my-3">78%</h2>
            <p className="text-gray-800 text-xl">Happy Users</p>
          </div>
          <div className="achievement-card bg-white bg-opacity-20 text-center p-16 rounded-lg backdrop-blur-sm">
            <span className="text-lg text-gray-600">Globally Available in</span>
            <h2 className="font-bold text-4xl text-purple-800 my-3">50</h2>
            <p className="text-gray-800 text-xl">Countries</p>
          </div>
        </div>
      </section>

      <section className="info-section p-40 px-36 h-2/4 text-center text-white backdrop-blur-sm">
        <h2 className="font-bold text-4xl mb-4">Why we built this?</h2>
        <p className="px-36 w-3/4 text-center mx-auto block">With knowledgeable mentors, we hope to assist you in developing an incredible career.
          We are here to support you as you advance, from junior to leadership.
        </p>
      </section>
    </>
  )
}

export default Home;
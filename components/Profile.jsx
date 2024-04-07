import Link from "next/link";
import { FaRegHeart, FaTwitter, FaYoutube } from "react-icons/fa";
import { HiOutlineDotsHorizontal } from "react-icons/hi";
import { ImLinkedin } from "react-icons/im";
import { FaRocket } from "react-icons/fa6";
import { BsStars } from "react-icons/bs";
import { GiSandsOfTime } from "react-icons/gi";
import { FcVideoCall } from "react-icons/fc";

import Header from "./Header";
import { useCallback, useEffect } from "react";
import { database, storage } from "@/lib/appwrite";
import { useNavigate } from 'react-router-dom'

const Profile = ({ isLoggedIn, setIsLoggedIn, profilePicture, userName, profilePictureExist, mentorUserId, setMentorUserId, mentorsList }) => {
  let mentorImage = storage.getFilePreview('660d64d1496e76a7e4aa', mentorUserId);
  const navigate = useNavigate();

  const handleJoinRoom = useCallback(() => {
    const promise = database.updateDocument(
      '660cf234f3a008730036',
      '660cf2ad06380c29d762',
      mentorUserId,
      {
        callRequests: userName
      }
    );
    promise.then(
      function (response) {
        console.log(response)
        navigate(`/room/${mentorUserId}`)
      }, function (err) {
        console.error(err);
      }
    );

  }, [navigate, mentorUserId])

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} profilePictureExist={profilePictureExist}></Header>
      <section className="my-24 px-24">
        {mentorsList.filter((item) => item.$id === mentorUserId).map((mentor, index) => {
          return (
            <>
              <div className="flex items-center justify-between border-b pb-8 border-gray-300" key={index}>
                <div className="flex items-center gap-10">
                  <img className="w-48 rounded-full border-4 border-black" src={mentorImage || "https://via.placeholder.com/80x80"} alt={mentor.userName} />
                  <div>
                    <h2 className="font-bold text-3xl">{mentor.userName}</h2>
                    <p className="text-1xl mt-1">{mentor.mentorBio || "N/A"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <button className="shadow-lg p-3 border border-secondary rounded-xl" onClick={() => alert("Thank you for the like!")}>
                    <FaRegHeart className="text-2xl" />
                  </button>
                  <button className="flex items-center gap-4 shadow-lg p-3 border border-secondary rounded-xl" onClick={() => handleJoinRoom()}>
                    <FcVideoCall className="text-2xl" />
                    <span>1:1 Video Call</span>
                  </button>
                </div>
              </div>

              <div className="my-8 px-4 flex justify-between gap-8">
                <div className="mt-9 w-8/12">
                  <p className="text-gray-500 w-4/7">I Provide Mentorship on: {mentor.intrests.map((intrest, index) => <span id="skills" className="text-green-600" key={index}>{intrest}, </span>)}</p>
                  <div className="flex items-center gap-3 my-5">
                    <Link href={'/'} className="text-1xl bg-gray-300 text-gray-800 rounded-full p-2">
                      <FaYoutube />
                    </Link>
                    <Link href={'/'} className="text-1xl bg-gray-300 text-gray-800 rounded-full p-2">
                      <ImLinkedin />
                    </Link>
                    <Link href={'/'} className="text-1xl bg-gray-300 text-gray-800 rounded-full p-2">
                      <FaTwitter />
                    </Link>
                  </div>
                </div>
                <div>
                  <div className="shadow-lg pt-5 rounded pb-4 px-6 mb-10">
                    <h4 className="font-bold text-2xl">Community Statistics</h4>
                    <div className="flex items-center gap-8 my-3">
                      <div className="flex items-center gap-4 my-4">
                        <div className="bg-blue-200 p-2 rounded text-blue-800 text-2xl">
                          <FaRocket />
                        </div>
                        <div>
                          <h6 className="font-bold">30 Hours</h6>
                          <p className="text-gray-600">Total Mentoring Time</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 my-4">
                        <div className="bg-orange-200 p-2 rounded text-orange-800 text-2xl">
                          <BsStars />
                        </div>
                        <div>
                          <h6 className="font-bold">48 Hours</h6>
                          <p className="text-gray-600">Total Chatting Time</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="shadow-lg pt-5 rounded pb-4 px-6">
                    <h4 className="font-bold text-2xl">Available Time</h4>
                    <p className="text-gray-500">Find the available time of the Mentor and chat with them!</p>
                    <div className="flex items-center gap-8 my-3">
                      <div className="flex items-center gap-4 my-4">
                        <div className="bg-green-200 p-2 rounded text-green-900 text-2xl">
                          <GiSandsOfTime />
                        </div>
                        <div>
                          <h6 className="font-bold">
                            {mentor.days.map((day, index) => {
                              return (
                                <span key={index} id="days"> {day} |</span>
                              )
                            })}
                          </h6>
                          <p className="text-gray-600">{mentor.startTime} - {mentor.endTime}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )
        })}
      </section>
    </>
  )
}

export default Profile;
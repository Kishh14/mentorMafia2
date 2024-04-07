import { useEffect, useState } from "react";
import Header from "./Header";
import { Link, useNavigate } from "react-router-dom";
import { database } from "@/lib/appwrite";
import { FcApproval } from "react-icons/fc";
import { FcMultipleDevices } from "react-icons/fc";
import { FcRules } from "react-icons/fc";
import { FcBullish } from "react-icons/fc";
import { FcCurrencyExchange } from "react-icons/fc";
import { FcDepartment } from "react-icons/fc";

const Mentors = ({ isLoggedIn, setIsLoggedIn, profilePicture, userName, userId, mentorsList, profilePictureExist, recipientUserId, setRecipientUserId, mentorUserId, setMentorUserId }) => {
  const navigate = useNavigate();
  const [filteredMentors, setFilteredMentors] = useState([]);

  useEffect(() => {
    setFilteredMentors(mentorsList);
  }, [mentorsList])

  const handleChatClick = (mentorId) => {
    setRecipientUserId(mentorId);

    // navigate('/chats');
  }

  const handleProfileClick = (mentorId) => {
    setMentorUserId(mentorId);
    navigate('/profile');
  }

  const handleNavClick = (mentorType) => {
    let topMentors = mentorsList.slice(3, 8);
    let techMentors = mentorsList.filter((mentor) => mentor.intrests.includes("Software Development"));
    let careerMentors = mentorsList.filter((mentor) => mentor.intrests.includes("Career Development"));
    let businessMentors = mentorsList.filter((mentor) => mentor.intrests.includes("Business/Startups"));
    let financeMentors = mentorsList.filter((mentor) => mentor.intrests.includes("Finance"));
    let healthcareMentors = mentorsList.filter((mentor) => mentor.intrests.includes("Healthcare"));

    if (mentorType === "Top Mentors") {
      setFilteredMentors(topMentors);
    } else if (mentorType === "Tech Mentors") {
      setFilteredMentors(techMentors);
    } else if (mentorType === "Career Mentors") {
      setFilteredMentors(careerMentors);
    } else if (mentorType === "Business Mentors") {
      setFilteredMentors(businessMentors);
    } else if (mentorType === "Finance Mentors") {
      setFilteredMentors(financeMentors);
    } else if (mentorType === "Healthcare Mentors") {
      setFilteredMentors(healthcareMentors);
    }
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} profilePictureExist={profilePictureExist}></Header>
      <section className="mentor-container min-h-screen w-full" x-data="layout">
        <div className="flex items-start">
          <aside className="flex w-72 flex-col space-y-2 bg-gray-600 bg-opacity-40 backdrop-blur-md text-white border-r-2 border-gray-400 py-10 px-4" style={{ height: "100vh" }}
            x-show="asideOpen">
            <button className="flex items-center gap-3 space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600" onClick={() => handleNavClick("Top Mentors")}>
              <span className="text-2xl"><FcApproval className="text-2xl m-auto" /></span>
              <span>Top Mentors</span>
            </button>

            <button className="flex items-center gap-3 space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600" onClick={() => handleNavClick("Tech Mentors")}>
              <span className="text-2xl"><FcMultipleDevices className="text-2xl m-auto" /></span>
              <span>Tech Mentors</span>
            </button>

            <button className="flex items-center gap-3 space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600" onClick={() => handleNavClick("Career Mentors")}>
              <span className="text-2xl"><FcRules className="text-2xl m-auto" /></span>
              <span>Career Mentors</span>
            </button>

            <button className="flex items-center gap-3 space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600" onClick={() => handleNavClick("Business Mentors")}>
              <span className="text-2xl"><FcBullish className="text-2xl m-auto" /></span>
              <span>Business Mentors</span>
            </button>

            <button className="flex items-center gap-3 space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600" onClick={() => handleNavClick("Finance Mentors")}>
              <span className="text-2xl"><FcCurrencyExchange className="text-2xl m-auto" /></span>
              <span>Finance Mentors</span>
            </button>

            <button className="flex items-center gap-3 space-x-1 rounded-md px-2 py-3 hover:bg-gray-100 hover:text-blue-600" onClick={() => handleNavClick("Healthcare Mentors")}>
              <span className="text-2xl"><FcDepartment className="text-2xl m-auto" /></span>
              <span>Healthcare Mentors</span>
            </button>
          </aside>

          <div className="custom-scrollbar w-full h-screen overflow-y-scroll px-11 py-10 flex items-center flex-wrap justify-center gap-14">
            {filteredMentors.length > 0 ? filteredMentors.map((mentor) => {
              return (
                <div className="mentor-card bg-black bg-opacity-40 backdrop-filter backdrop-blur-md p-3 text-white rounded-lg shadow-md max-w-xs min-h-64 block" key={mentor.$id}>
                  <img className="w-64 h-60 object-cover rounded-lg mb-2 border border-gray-300 cursor-pointer" src={mentor.image} alt="Mentor-1" onClick={() => handleProfileClick(mentor.$id)} />
                  <div className="mentor-info flex justify-between px-1 cursor-pointer" onClick={() => handleProfileClick(mentor.$id)}>
                    <p className="cursor-pointer" onClick={() => handleProfileClick(mentor.$id)}>{mentor.userName}</p>
                    <div className="mentor-rating flex gap-2">
                      5.0 <img src={"https://assets-global.website-files.com/5d3ead70b1eba4033920a2bd/62ca00c609e7a23bc8e9e541_GreenStar.svg"} alt="1-Star" />
                    </div>
                  </div>
                  <p className="text-xs px-1 mt-1">{mentor.mentorBio || 'N/A'}</p>
                  <p className="text-xs px-1 mt-1">
                    <span> {mentor.intrests.length > 0 ? `${mentor.intrests[0]} |` : 'N/A'}</span>
                    <span> {mentor.intrests[1]} </span>
                  </p>
                  {/* <div className="flex"> */}
                  <button className='w-full bg-green-600 text-white p-1 mt-3 rounded' onClick={() => handleChatClick(mentor.$id)} id="">Chat Now</button>
                  {/* <button className='w-full bg-green-600 text-white p-1 mt-3 rounded' onClick={() => handleChatClick(mentor.$id)} id="">1:1 Video Call</button> */}
                  {/* </div> */}
                </div>
              );
            }) : <h3 className="text-center my-1 text-2xl text-white">Coming soon...</h3>
            }
          </div>
        </div>
      </section>
    </>
  );
};

export default Mentors;
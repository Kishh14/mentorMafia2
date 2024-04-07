"use client"
import Login from "@/components/Login";
import Signup from "@/components/Singup";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import HomePage from "@/components/HomePage";
import Profile from "@/components/Profile";
import Account from "@/components/Account";
import { useEffect, useState } from "react";
import { account, database, storage } from "@/lib/appwrite";
import Mentors from "@/components/Mentors";
import Room from "@/components/Room";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');
  const [userId, setUserId] = useState('');
  const [profilePicture, setProfilePicture] = useState('');
  const [profilePictureExist, setProfilePictureExist] = useState(false);
  const [usersList, setUsersList] = useState([]);
  const [mentorsList, setMentorsList] = useState([]);
  const [recipientUserId, setRecipientUserId] = useState('');
  const [mentorUserId, setMentorUserId] = useState('');
  const [callRequests, setCallRequests] = useState(null);

  const navigate = useNavigate();
  const { roomId } = useParams();

  useEffect(() => {
    const filteredMentors = usersList.filter((item) => item.accountType === "Mentor");
    const promises = filteredMentors.map(async (mentor) => {
      const imageUrl = await storage.getFilePreview('660d64d1496e76a7e4aa', mentor.$id);
      return { ...mentor, image: imageUrl };
    });

    Promise.all(promises).then((processedMentors) => {
      setMentorsList(processedMentors);
    });
  }, [usersList]);

  const getProfilePicture = () => {
    const accountProm = account.get();
    accountProm.then(
      async function (response) {
        const promise = await storage.getFilePreview('660d64d1496e76a7e4aa', response.$id);
        setProfilePicture(promise);
        fetch(promise)
          .then((r) => {
            if (r.status !== 404) {
              setProfilePictureExist(true);
            } else {
              setProfilePictureExist(false);
            }
          });
      }, function (err) {
        console.error(err)
        setProfilePictureExist(false)
      }
    )
  };

  const getAccount = () => {
    const promise = account.get();
    promise.then(
      function (response) {
        setUserId(response.$id);
        setUserName(response.name);
      }, function (err) {
        console.error(err);
      }
    )
  }

  const getUsersList = () => {
    const promise = database.listDocuments('660cf234f3a008730036',
      '660cf2ad06380c29d762');
    promise.then(
      function (response) {
        setUsersList(response.documents)
      }, function (err) {
        console.error(err)
      }
    )
  }

  const handleNotification = () => {
    const accountProm = account.get();
    accountProm.then(
      function (accountResponse) {
        setInterval(() => {
          const dataProm = database.getDocument(
            '660cf234f3a008730036', '660cf2ad06380c29d762', accountResponse.$id,
          )
          dataProm.then(
            function (response) {
              let roomId2 = response.$id;
              if (response.accountType === "Mentor") {
                if (response.callRequests) {
                  setTimeout(() => {
                    if (confirm(response.callRequests + " is calling you, would you like to answer?")) {
                      console.log(roomId2)
                      console.log(roomId)
                      navigate(`/room/${roomId2}`);
                      const deleteProm = database.updateDocument(
                        '660cf234f3a008730036', '660cf2ad06380c29d762', accountResponse.$id, {
                        callRequests: "",
                      }
                      );
                      deleteProm.then(
                        function (deleteRespo) {
                          console.log(deleteRespo)
                        }, function (err) {
                          console.error(err);
                        }
                      )
                    } else {
                      alert("Call has been declined!");
                    }
                  }, 3000);
                }
              }
            }, function (err) {
              console.error(err);
            }
          )
        }, 5000)
      }, function (err) {
        console.error(err);
      }
    )
  }

  useEffect(() => {
    getProfilePicture();
    getAccount();
    getUsersList();
    handleNotification();
  }, [])


  return (
    <main>
      <Routes>
        <Route path="/" element={<HomePage isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} profilePictureExist={profilePictureExist} mentorsList={mentorsList} setMentorUserId={setMentorUserId} />} />
        <Route path="/signup" element={<Signup isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} setUserName={setUserName} profilePictureExist={profilePictureExist} />} />
        <Route path="/login" element={<Login isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} />} />
        <Route path="/profile" element={<Profile isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} profilePictureExist={profilePictureExist} mentorUserId={mentorUserId} setMentorUserId={setMentorUserId} mentorsList={mentorsList} />} />
        <Route path="/account" element={<Account isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} setProfilePicture={setProfilePicture} profilePicture={profilePicture} profilePictureExist={profilePictureExist} setProfilePictureExist={setProfilePictureExist} getProfilePicture={getProfilePicture} userName={userName} setUserName={setUserName} userId={userId} setUserId={setUserId} getAccount={getAccount} />} />
        <Route path="/mentors" element={<Mentors isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} usersList={usersList} mentorsList={mentorsList} profilePictureExist={profilePictureExist} recipientUserId={recipientUserId} setRecipientUserId={setRecipientUserId} userId={userId} mentorUserId={mentorUserId} setMentorUserId={setMentorUserId} />} />
        <Route path="/room/:roomId" element={<Room mentorUserId={mentorUserId} userId={userId} userName={userName} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} profilePictureExist={profilePictureExist} />}></Route>
      </Routes>
    </main>
  );
}
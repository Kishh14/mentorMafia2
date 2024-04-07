import { account, database, storage } from "@/lib/appwrite";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";

const Account = ({ isLoggedIn, setIsLoggedIn, profilePicture, setProfilePicture, setProfilePictureExist, profilePictureExist, getProfilePicture, userName, setUserName, userId, setUserId, getAccount }) => {
  const navigate = useNavigate();
  const [mentorBio, setMentorBio] = useState('');
  const [days, setDays] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [accountType, setAccountType] = useState('Mentee');
  const [userIntrests, setUserIntrests] = useState([]);
  const [userAddress, setUserAddress] = useState('');
  const [userCity, setUserCity] = useState('');
  const [userCountry, setUserCountry] = useState('');
  const [userExist, setUserExist] = useState(false);

  useEffect(() => {
    getAccount();
    getUserData();
    getProfilePicture();
  }, [])

  const interests = [
    { label: "Software Development", value: "Software Development" },
    { label: "Career Development", value: "Career Development" },
    { label: "Personality Development", value: "Personality Development" },
    { label: "Business/Startups", value: "Business/Startups" },
    { label: "Finance", value: "Finance" },
    { label: "Healthcare", value: "Healthcare" },
  ];

  const handleInterestChange = (event) => {
    const { checked, value } = event.target;
    setUserIntrests(
      checked
        ? [...userIntrests, value]
        : userIntrests.filter((interest) => interest !== value)
    );

  };

  const getUserData = () => {
    const accountProm = account.get();
    accountProm.then(
      function (response) {
        const promise = database.getDocument(
          '660cf234f3a008730036',
          '660cf2ad06380c29d762',
          String(response.$id)
        )
        promise.then(
          function (response) {
            setUserExist(true);
            setUserIntrests(response.intrests)
            setUserAddress(response.address)
            setUserCity(response.city)
            setUserCountry(response.country)
            setAccountType(response.accountType || "Mentee")
            setMentorBio(response.mentorBio)
            setDays(response.days || [])
            setStartTime(response.startTime)
            setEndTime(response.endTime)
          }, function (err) {
            setUserExist(false);
            console.error(err);
          }
        )
      }, function (err) {
        console.error(err)
      }
    )
  }

  const logoutUser = () => {
    const promise = account.deleteSession('current');
    promise.then(
      function (response) {
        alert("Logged out successfully!");
        setIsLoggedIn(false);
        navigate("/");
      }, function (error) {
        setIsLoggedIn(true);
        console.error(error);
        alert("Error Occured, " + error)
      }
    )
  }

  const handleSave = () => {
    if (userName) {
      const updateName = account.updateName(userName);
      updateName.then(
        function (response) {
        }, function (error) {
          console.error(error)
        }
      );
    }

    if (accountType === 'Mentor') {
      if (!mentorBio || !userIntrests.length || profilePictureExist || !days.length || !startTime || !endTime) {
        alert("Please fill in all required fields for Mentors (Profile picture, Bio, Skills, Days and Time you're Available).");
        return;
      }
    }

    if (userExist) {
      const promise = database.updateDocument(
        '660cf234f3a008730036',
        '660cf2ad06380c29d762',
        String(userId),
        {
          userName: userName,
          intrests: userIntrests || [],
          address: userAddress || "",
          city: userCity || "",
          country: userCountry || "",
          accountType: accountType || 'Mentee',
          mentorBio: mentorBio || "",
          days: days || [],
          startTime: startTime || "",
          endTime: endTime || "",
        }
      )
      promise.then(
        function (response) {
          getUserData();
          alert("Profile details updated successfully!")
        }, function (err) {
          console.error(err)
        }
      )
    } else {
      const promise = database.createDocument(
        '660cf234f3a008730036',
        '660cf2ad06380c29d762',
        String(userId),
        {
          userName: userName,
          intrests: userIntrests || [],
          address: userAddress || "",
          city: userCity || "",
          country: userCountry || "",
          accountType: accountType || 'Mentee',
          mentorBio: mentorBio || "",
          days: days || [],
          startTime: startTime || "",
          endTime: endTime || "",
        }
      )

      promise.then(
        function (response) {
          alert("Profile details updated successfully!")
          getUserData();
        }, function (err) {
          console.error(err)
        }
      )
    }
  }

  const handleSetProfilePicture = (e) => {
    const accountPromise = account.get();
    accountPromise.then(
      function (data) {
        if (profilePictureExist) {
          const promise = storage.deleteFile('660d64d1496e76a7e4aa', data.$id);
          promise.then(
            function (response) {
              const promise = storage.createFile('660d64d1496e76a7e4aa', data.$id, e.target.files[0]);
              promise.then(
                function (response) {
                  alert("Picture changed successfully!");
                  getProfilePicture();
                }, function (err) {
                  alert("Error occured, please try again later!")
                  console.error(err)
                }
              )
            }, function (err) {
              console.error(err)
            }
          )
        } else {
          const promise = storage.createFile('660d64d1496e76a7e4aa', data.$id, e.target.files[0]);
          promise.then(
            function (response) {
              getProfilePicture();
            }, function (err) {
              console.error(err)
            }
          )
        }
      }, function (err) {
        console.error(err)
      }
    )
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} profilePictureExist={profilePictureExist}></Header>
      {isLoggedIn && <section className="py-1 bg-blueGray-50">
        <div className="w-full lg:w-8/12 px-4 mx-auto mt-6">
          <div className="relative flex flex-col min-w-0 break-words w-full mb-6 shadow-lg rounded-lg bg-blueGray-100 border-0">
            <div className="rounded-t bg-white mb-0 px-6 py-6">
              <div className="text-center flex justify-between">
                <h6 className="text-blueGray-700 text-xl font-bold">
                  My account
                </h6>
                <button onClick={logoutUser} className="bg-red-500 text-white active:bg-red-600 font-bold uppercase text-xs px-4 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150" type="button">
                  Logout
                </button>
              </div>
            </div>
            <div className="flex-auto px-4 lg:px-10 py-10 pt-0">
              <form>
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  User Information
                </h6>
                <div className="w-full mx-auto my-7 lg:w-6/12 px-4">
                  <div className="relative w-full mb-5">
                    <img className="m-auto rounded-full mb-2 w-28 h-28" src={profilePictureExist ? profilePicture : "https://via.placeholder.com/80x80"} alt="Profile Picture" />
                    {profilePictureExist ? null : <input type="file" accept=".jpg, .png, .jpeg" onChange={(e) => handleSetProfilePicture(e)} className="border-0 p-2 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring m-auto block ease-linear transition-all duration-150" />}
                  </div>
                </div>
                <div className="flex flex-wrap">
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                        Username
                      </label>
                      <input type="text" value={userName} onChange={(e) => setUserName(e.target.value)} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="lucky.jesse" />
                    </div>
                    <div className="relative w-full my-6">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                        Change account type
                      </label>
                      <label htmlFor="mentor" className="mr-3 ml-2 text-sm font-medium text-gray-700">
                        <input type="radio" name="accountType" id="mentor" checked={accountType === 'Mentor'} value={'Mentor'} onChange={(e) => setAccountType(e.target.value)} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150" /> Mentor
                      </label>
                      <label htmlFor="mentee" className="ml-2 text-sm font-medium text-gray-700">
                        <input type="radio" name="accountType" id="mentee" checked={accountType === 'Mentee'} value={'Mentee'} onChange={(e) => setAccountType(e.target.value)} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150" /> Mentee
                      </label>
                    </div>
                    {accountType === 'Mentor' && <div className="relative w-full mt-5">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                        Bio <span className="text-gray-500" style={{ fontSize: '9px' }}>(Max 38 characters)</span>
                      </label>
                      <textarea type="text" value={mentorBio} onChange={(e) => setMentorBio(e.target.value.slice(0, 38))} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" rows="4" placeholder='A Software Development mentor | Ex - Amazon'></textarea>
                    </div>}
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      {accountType === 'Mentee' ? <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Intrests <span className="text-gray-500" style={{ fontSize: '11px' }}>(used to show relevent content)</span>
                      </label> : <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                        Can Provide Mentorship in:
                      </label>}
                      <div className='flex flex-wrap items-center gap-3'>
                        {interests.map((interest) => (
                          <div key={interest.value} className="flex items-center mb-1 mr-3">
                            <input
                              type="checkbox"
                              id={interest.value}
                              value={interest.value}
                              checked={userIntrests.includes(interest.value)}
                              onChange={handleInterestChange}
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                            />
                            <label
                              htmlFor={interest.value}
                              className="ml-2 text-sm font-medium text-gray-700"
                            >
                              {interest.label}
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {accountType === 'Mentor' && (<>
                      <div className="relative w-full my-6">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Days available <span className="text-gray-500" style={{ fontSize: '11px' }}>(select the days you will be mostly available):</span>
                        </label>
                        <div className="flex items-center flex-wrap gap-3">
                          <div className="flex items-center gap-2">
                            <label htmlFor="monday" className="ml-2 text-sm font-medium text-gray-700">Mon</label>
                            <input
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                              type="checkbox"
                              id="monday"
                              name="days[]"
                              value="Mon"
                              checked={days?.includes('Mon')}
                              onChange={(e) => {
                                const newDays = [...days];
                                if (e.target.checked) {
                                  newDays.push(e.target.value);
                                } else {
                                  const index = newDays.indexOf(e.target.value);
                                  newDays.splice(index, 1);
                                }
                                setDays(newDays);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label htmlFor="tuesday" className="ml-2 text-sm font-medium text-gray-700">Tue</label>
                            <input
                              type="checkbox"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                              id="tuesday"
                              name="days[]"
                              value="Tue"
                              checked={days?.includes('Tue')}
                              onChange={(e) => {
                                const newDays = [...days];
                                if (e.target.checked) {
                                  newDays.push(e.target.value);
                                } else {
                                  const index = newDays.indexOf(e.target.value);
                                  newDays.splice(index, 1);
                                }
                                setDays(newDays);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label htmlFor="wednesday" className="ml-2 text-sm font-medium text-gray-700">Wed</label>
                            <input
                              type="checkbox"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                              id="wednesday"
                              name="days[]"
                              value="Wed"
                              checked={days?.includes('Wed')}
                              onChange={(e) => {
                                const newDays = [...days];
                                if (e.target.checked) {
                                  newDays.push(e.target.value);
                                } else {
                                  const index = newDays.indexOf(e.target.value);
                                  newDays.splice(index, 1);
                                }
                                setDays(newDays);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label htmlFor="thursday" className="ml-2 text-sm font-medium text-gray-700">Thu</label>
                            <input
                              type="checkbox"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                              id="thursday"
                              name="days[]"
                              value="Thu"
                              checked={days?.includes('Thu')}
                              onChange={(e) => {
                                const newDays = [...days];
                                if (e.target.checked) {
                                  newDays.push(e.target.value);
                                } else {
                                  const index = newDays.indexOf(e.target.value);
                                  newDays.splice(index, 1);
                                }
                                setDays(newDays);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label htmlFor="friday" className="ml-2 text-sm font-medium text-gray-700">Fri</label>
                            <input
                              type="checkbox"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                              id="friday"
                              name="days[]"
                              value="Fri"
                              checked={days?.includes('Fri')}
                              onChange={(e) => {
                                const newDays = [...days];
                                if (e.target.checked) {
                                  newDays.push(e.target.value);
                                } else {
                                  const index = newDays.indexOf(e.target.value);
                                  newDays.splice(index, 1);
                                }
                                setDays(newDays);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label htmlFor="saturday" className="ml-2 text-sm font-medium text-gray-700">Sat</label>
                            <input
                              type="checkbox"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                              id="saturday"
                              name="days[]"
                              value="Sat"
                              checked={days?.includes('Sat')}
                              onChange={(e) => {
                                const newDays = [...days];
                                if (e.target.checked) {
                                  newDays.push(e.target.value);
                                } else {
                                  const index = newDays.indexOf(e.target.value);
                                  newDays.splice(index, 1);
                                }
                                setDays(newDays);
                              }}
                            />
                          </div>
                          <div className="flex items-center gap-2">
                            <label htmlFor="sunday" className="ml-2 text-sm font-medium text-gray-700">Sun</label>
                            <input
                              type="checkbox"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring ease-linear transition-all duration-150"
                              id="sunday"
                              name="days[]"
                              value="Sun"
                              checked={days?.includes('Sun')}
                              onChange={(e) => {
                                const newDays = [...days];
                                if (e.target.checked) {
                                  newDays.push(e.target.value);
                                } else {
                                  const index = newDays.indexOf(e.target.value);
                                  newDays.splice(index, 1);
                                }
                                setDays(newDays);
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="relative w-full mb-6">
                        <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2">
                          Time available <span className="text-gray-500" style={{ fontSize: '11px' }}>(select the time you will be mostly online):</span>
                        </label>
                        <div className="flex items-center gap-10">
                          <div className="flex flex-col mb-2">
                            <label htmlFor="startTime" className="ml-2 text-sm font-medium text-gray-700">Start Time:</label>
                            <input
                              type="time"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              id="startTime"
                              value={startTime}
                              onChange={(e) => setStartTime(e.target.value)}
                              required={accountType === 'Mentor'}
                            />
                            <label htmlFor="endTime" className="ml-2 text-sm font-medium text-gray-700 mt-3">End Time:</label>
                            <input
                              type="time"
                              className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150"
                              id="endTime"
                              value={endTime}
                              onChange={(e) => setEndTime(e.target.value)}
                              required={accountType === 'Mentor'}
                            />
                          </div>
                        </div>
                      </div></>)}
                  </div>
                </div>

                <hr className="mt-6 border-b-1 border-blueGray-300" />
                <h6 className="text-blueGray-400 text-sm mt-3 mb-6 font-bold uppercase">
                  Contact Information
                </h6>
                <div className="flex justify-between flex-wrap">
                  <div className="w-full lg:w-12/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                        Address
                      </label>
                      <input type="text" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09" />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                        City
                      </label>
                      <input type="text" value={userCity} onChange={(e) => setUserCity(e.target.value)} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="New York" />
                    </div>
                  </div>
                  <div className="w-full lg:w-6/12 px-4">
                    <div className="relative w-full mb-3">
                      <label className="block uppercase text-blueGray-600 text-xs font-bold mb-2" htmlFor="grid-password">
                        Country
                      </label>
                      <input type="text" value={userCountry} onChange={(e) => setUserCountry(e.target.value)} className="border-0 px-3 py-3 placeholder-blueGray-300 text-blueGray-600 bg-white rounded text-sm shadow focus:outline-none focus:ring w-full ease-linear transition-all duration-150" placeholder="United States" />
                    </div>
                  </div>
                </div>

                <button onClick={handleSave} className="bg-green-500 text-white active:bg-green-600 font-bold uppercase text-xs px-8 py-2 rounded shadow hover:shadow-md outline-none focus:outline-none mr-1 ease-linear transition-all duration-150 block mx-auto" type="button">
                  Save
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>}
    </>
  )
}

export default Account;
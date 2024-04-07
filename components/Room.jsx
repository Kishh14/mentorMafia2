import { useParams, useNavigate } from 'react-router-dom';
import { ZIM } from "zego-zim-web";
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import Header from './Header';

const Room = ({ mentorUserId, userId, userName, isLoggedIn, setIsLoggedIn, profilePicture, profilePictureExist }) => {
  const navigate = useNavigate();
  const { roomId } = useParams();

  const myVideoCall = async (element) => {
    const userID = String(userId);
    const userName2 = userName;
    const appId = 36177414;
    const serverSecret = '2f4674cd928cb89c9a42a45cc84bf828';

    const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(appId, serverSecret, roomId, userID, userName2);
    const zCloud = ZegoUIKitPrebuilt.create(kitToken);

    zCloud.joinRoom({
      container: element,
      scenario: {
        mode: ZegoUIKitPrebuilt.OneONoneCall,
      },
      onLeaveRoom: () => {
        navigate('/')
        // window.location.reload();
      }
    })
  }


  return (
    <>
      <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} profilePicture={profilePicture} userName={userName} profilePictureExist={profilePictureExist}></Header>
      <section className='my-6 px-48 mx-auto'>
        <div className="shadow-md p-3">
          <h3 className='my-1 font-bolder text-2xl'>Guide:</h3>
          <p className='my-2'>* Ensure to allow the camera, and mic persmission in the broswer</p>
          <p className='my-2'>* Click on the black screen (your screen) to see the controls</p>
          <p className='my-2'>* You can also share the screen while on call</p>
        </div>

        <div className='w-9/12 shadow-lg rounded-md mx-auto p-10'>
          <div ref={myVideoCall} />
        </div>
      </section>
    </>
  )
}

export default Room;
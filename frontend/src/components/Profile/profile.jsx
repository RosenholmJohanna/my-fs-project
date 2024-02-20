import React, { useEffect, useState} from "react";
import { useDispatch, useSelector} from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import user from "../../reducers/userReduser";

const BASE_URL = "http://localhost:8080";

const MyProfilePage = ({}) => {
  const accessToken = useSelector((store) => store.user.accessToken);
  const [userProfile, setUserProfile] = useState();
  const [motivation, setMotivation] = useState()
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
 

  useEffect(() => {
    if (!accessToken) {
      navigate("/");
    }
  }, [accessToken]);

  useEffect(() => {
    const options = {
      method: "GET",
      headers: {
        'Content-Type': 'application/json',
        "Authorization": accessToken
      }
    };

    fetch(`${BASE_URL}/users/${id}`, options)
      .then(res => res.json())
      .then(data => {
        setUserProfile(data);
        setMotivation(data.motivation)
        dispatch(user.actions.setMotivation(data.motivation));
      })
      .catch(error => console.error(error));
  }, [accessToken, id, dispatch]);


  return (  
    <div>
    {userProfile ? (
      <div>
        <h2>User Profile</h2>
        <p>Username: {userProfile.username}</p>
        <p>Motivation: {userProfile.motivation}</p>
      </div>
    ) : (
      <p>Loading...</p>
    )}
  </div>
  );
};

export default MyProfilePage;   
import React, { useEffect, useState } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";

const UserList = ({ users, isLoading }) => {
  const [hoveredUserId, setHoveredUserId] = useState();
  const [favoriteUsers, setFavoriteUsers] = useState([]);
  const [userList,setUsers] = useState([]);
  const [selectedCountry,setCountry] = useState([]);
  const [countryList,setCountryList] = useState([]);
  let localFavoriteUsers = [...favoriteUsers];
  let [favoriteUsersFromLocalStorage,setFavoriteFromLS] = useState([]);
  let favoriteUsersToLocalStorage =[];

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };

  
  const addToFavorite = (user)=>{
    if(!favoriteUsers.includes(user)){
    localFavoriteUsers =[...favoriteUsers,user];
    }else{
    localFavoriteUsers = localFavoriteUsers.filter(function(item){
      return (item !== user);
    })
    }
    setFavoriteUsers(localFavoriteUsers);
    favoriteUsersToLocalStorage = favoriteUsersFromLocalStorage.concat(localFavoriteUsers);
    localStorage.setItem("favoriteUsers", JSON.stringify(favoriteUsersToLocalStorage));
  };
  

  const filterByCountery = (value,label,isChecked) => {
    let newSelectedCountries = [...selectedCountry];
    if(isChecked){ 
      newSelectedCountries = [...selectedCountry,label];
    }else{
      newSelectedCountries = newSelectedCountries.filter(function(item){
        return (item !== label);
      }) 
    }

    const filterUsers = (newSelectedCountries.length === 0) ? users : users.filter(function(item){
      return (newSelectedCountries.indexOf(item.location.country) !== -1 );
    })
    setCountry(newSelectedCountries);
    setUsers(filterUsers) 
  };

  const getPopulerCuntries = (users) => {
    let countryMap = new Map();
    users.forEach(element => {
        if (countryMap.get(element.location.country)!=null){
          countryMap.set(element.location.country,countryMap.get(element.location.country)+1);
        }
        else{
            countryMap.set(element.location.country,1);
        }    
    });
    let newCountries= [...countryMap.entries()].sort((a,b)=> b[1] - a[1]).slice(0,5);
    setCountryList(newCountries);
  }
 
  useEffect(()=>{ 
    setUsers(users);
    getPopulerCuntries(users)
    if(JSON.parse(localStorage.getItem("favoriteUsers"))=== null){
      setFavoriteFromLS([]);
    }else{
    setFavoriteFromLS(JSON.parse(localStorage.getItem("favoriteUsers")));
    }
  },[users])
 

  return (
    <S.UserList>
      <S.Filters>
        {countryList.map((country)=>{
         return(
           <CheckBox  label={country[0]} onChange={filterByCountery} />
         )
       })}
      </S.Filters>
      <S.List>
        {userList.map((user, index) => {
          return (
            <S.User
              key={index}
              onMouseEnter={() => handleMouseEnter(index)}
              onMouseLeave={handleMouseLeave}
            >
              <S.UserPicture src={user?.picture.large} alt="" />
              <S.UserInfo>
                <Text size="22px" bold>
                  {user?.name.title} {user?.name.first} {user?.name.last}
                </Text>
                <Text size="14px">{user?.email}</Text>
                <Text size="14px">
                  {user?.location.street.number} {user?.location.street.name}
                </Text>
                <Text size="14px">
                  {user?.location.city} {user?.location.country}
                </Text>
              </S.UserInfo>
              <S.IconButtonWrapper isVisible={index === hoveredUserId || favoriteUsers.includes(user) }>
                <IconButton  onClick={()=>addToFavorite(user)}>
                  <FavoriteIcon color="error" />
                </IconButton>
              </S.IconButtonWrapper>
            </S.User>
          );
        })}
        {isLoading && (
          <S.SpinnerWrapper>
            <Spinner color="primary" size="45px" thickness={6} variant="indeterminate" />
          </S.SpinnerWrapper>
        )}
      </S.List>
    </S.UserList>
  );
};

export default UserList;

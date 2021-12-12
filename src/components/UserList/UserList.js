import React, { useEffect, useState } from "react";
import Text from "components/Text";
import Spinner from "components/Spinner";
import CheckBox from "components/CheckBox";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";

const UserList = ({ users, isLoading }) => {
  const [hoveredUserId, setHoveredUserId] = useState();
  const [favoritUsers, setFavoritUsers] = useState([]);
  const [userList,setUsers] = useState([]);
  const [selectedCountry,setCountry] = useState([]);
  const [countryList,setCountryList] = useState([]);
  let localFavoritUsers = [...favoritUsers];
  let [favoritUsersFromLocalStorage,setFavoritFromLS] = useState([]);
  let favoritUsersToLocalStorage =[];

  const handleMouseEnter = (index) => {
    setHoveredUserId(index);
  };

  const handleMouseLeave = () => {
    setHoveredUserId();
  };

  
  const addToFavorite = (user)=>{
    if(!favoritUsers.includes(user)){
    localFavoritUsers =[...favoritUsers,user];
    }else{
    localFavoritUsers = localFavoritUsers.filter(function(item){
      return (item !== user);
    })
    }
    setFavoritUsers(localFavoritUsers);
    favoritUsersToLocalStorage = favoritUsersFromLocalStorage.concat(localFavoritUsers);
    localStorage.setItem("favoritUsers", JSON.stringify(favoritUsersToLocalStorage));
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
    console.log(countryMap);
    console.log(newCountries);
    setCountryList(newCountries);
  }
 
  useEffect(()=>{ 
    setUsers(users);
    getPopulerCuntries(users)
    if(JSON.parse(localStorage.getItem("favoritUsers"))=== null){
      setFavoritFromLS([]);
    }else{
    setFavoritFromLS(JSON.parse(localStorage.getItem("favoritUsers")));
    }
  },[users])
 

  return (
    <S.UserList>
      <S.Filters>
        {/*
        <CheckBox value="BR" label="Brazil" onChange={filterByCountery} />
        <CheckBox value="AU" label="Australia" onChange={filterByCountery} />
        <CheckBox value="CA" label="Canada" onChange={filterByCountery} />
        <CheckBox value="DE" label="Germany" onChange={filterByCountery}/>
        */}
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
              <S.IconButtonWrapper isVisible={index === hoveredUserId || favoritUsers.includes(user) }>
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

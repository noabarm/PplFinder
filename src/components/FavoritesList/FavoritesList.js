import React, { useEffect, useState } from "react";
import Text from "components/Text";
import IconButton from "@material-ui/core/IconButton";
import FavoriteIcon from "@material-ui/icons/Favorite";
import * as S from "./style";

const FavoritesList = ({favoritesUsersList})=>{

    const [updateFavoriteList, setUpdateFavoriteList] = useState([]);
    
    const removeFromFavorite = (user)=>{
      let updateList = updateFavoriteList.filter(function(item){
        return (item !== user);
      })
      setUpdateFavoriteList(updateList);
      localStorage.setItem("favoriteUsers", JSON.stringify(updateList));
    };
    
  
    
 
    useEffect(()=>{ 
      setUpdateFavoriteList(favoritesUsersList);
    },[favoritesUsersList])
 
   
  
    return (
      <S.UserList>
        <S.List>
          {updateFavoriteList.map((user, index) => {
            return (
              <S.User
                key={index}
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
                <S.IconButtonWrapper isVisible={true}>
                  <IconButton  onClick={()=>removeFromFavorite(user)}>
                    <FavoriteIcon color="error" />
                  </IconButton>
                </S.IconButtonWrapper>
              </S.User>
            );
          })}
        </S.List>
      </S.UserList>
    );
};

export default FavoritesList;
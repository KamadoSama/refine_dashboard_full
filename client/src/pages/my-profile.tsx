import { useGetIdentity, useOne } from "@pankod/refine-core/"
import { Profile } from "components"


const myProfile = () => {
  const {data:user} = useGetIdentity();
  const {data, isLoading, isError} = useOne({
    resource:'users',
    id:user?.userid,
  })

  const myProfile = data?.data ?? [];
  if(isLoading){
    return <div>en cours de chargement ...</div>
  }
  if(isError){
    return <div>il y a eu une erreur..</div>
  }

  return (
     <Profile
      type = "Mon Profil"
      name={myProfile.name}
      email = {myProfile.email}
      avatar = {myProfile.avatar}
      properties={myProfile.allProperties}
      
     />
  )
}

export default myProfile
import { useOne } from "@pankod/refine-core/"
import { Profile } from "components"
import { useParams } from "@pankod/refine-react-router-v6";


const AgentProfile = () => {
  const {id} = useParams();
  const {data, isLoading, isError} = useOne({
    resource:'users',
    id:id as string,
  })

  const AgentProfile = data?.data ?? [];
  if(isLoading){
    return <div>en cours de chargement ...</div>
  }
  if(isError){
    return <div>il y a eu une erreur..</div>
  }

  return (
     <Profile
      type = "Agent"
      name={AgentProfile.name}
      email = {AgentProfile.email}
      avatar = {AgentProfile.avatar}
      properties={AgentProfile.allProperties}
      
     />
  )
}

export default AgentProfile
import React from "react";

import { Refine, AuthProvider } from "@pankod/refine-core";
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";
import {
  AccountCircleOutlined,
  ChatBubbleOutline,
  Face4,
  PeopleAltOutlined,
  StartOutlined,
  VillaOutlined,
} from '@mui/icons-material'
import dataProvider from "@refinedev/simple-rest";
import { MuiInferencer } from "@pankod/refine-inferencer/mui";
import routerProvider from "@pankod/refine-react-router-v6";
import axios, { AxiosRequestConfig } from "axios";
import { RefineKbarProvider } from "@pankod/refine-kbar";
import { ColorModeContextProvider } from "contexts";
import { Title, Sider, Layout, Header } from "components/layout";
import { 
  Login,
  Home,
  Agents,
  MyProfile,
  PropertyDetails,
  AllProperties,
  AgentProfile,
  EditProperty,
  CreateProperty
} from "pages/index";
import { CredentialResponse } from "interfaces/google";
import { parseJwt } from "utils/parse-jwt";
import { OffLayoutArea } from "components/offLayoutArea";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const authProvider: AuthProvider = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;
      // Enregistrer utilisateur dans MongoDB ...
      if(profileObj){
        const response = await fetch('http://localhost:8080/api/v1/users',{
          method:'POST',
          headers: {'Content-Type':'application/json'},
          body:JSON.stringify({
            name:profileObj.name,
            email:profileObj.email,
            avatar:profileObj.picture,
          })
        })
        const data = await response.json();
        if(response.status===200){
          
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
            userid:data._id
          })
        );

        }
      }else{
        return Promise.reject();
      }
      localStorage.setItem("token", `${credential}`);

      return Promise.resolve();
    },
    logout: () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return Promise.resolve();
        });
      }

      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return Promise.resolve();
      }
      return Promise.reject();
    },

    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return Promise.resolve(JSON.parse(user));
      }
    },
  };

  return (
    <ColorModeContextProvider>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <RefineKbarProvider>
          <Refine
            dataProvider={dataProvider("http://localhost:8080/api/v1")}
            notificationProvider={notificationProvider}
            ReadyPage={ReadyPage}
            catchAll={<ErrorComponent />}
            resources={[
              {
                name: "properties",
                options:{
                  label:"propriétés"
                },
                list: AllProperties,
                show: PropertyDetails,
                create: CreateProperty,
                edit: EditProperty,
                icon:< VillaOutlined/>
              },
              {
                name: "agents",
                list: Agents,
                show: AgentProfile,
                icon:<PeopleAltOutlined/>
              },
              {
                name: "reviews",
                options:{
                  label:'revues'
                },
                list: Home,
                icon:<StartOutlined/>
              },
              {
                name: "message",
                list: Home,
                icon:<ChatBubbleOutline/>
              },
              {
                name: "mon-profil",
                list: MyProfile,
                options:{
                  label:'mon profil',
                },
                icon:<AccountCircleOutlined/>
              },
            ]}
            Title={Title}
            Sider={Sider}
            Layout={Layout}
            Header={Header}
            routerProvider={routerProvider}
            authProvider={authProvider}
            LoginPage={Login}
            OffLayoutArea={OffLayoutArea}
            DashboardPage={Home}
          />
        </RefineKbarProvider>
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  );
}

export default App;

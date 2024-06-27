import React from "react"
import MainLayout from "../layouts/MainLayout"
import Sidebar from "../components/Sidebar";
import AuthOverlay from "../components/AuthOverlay" 
import { Flex } from "@mantine/core"
import RoomList from "../components/RoomList"
import ProtectedRoutes from "../components/ProtectedRoutes"
function Home() {
  return (
    <MainLayout>
      <div
        style={{
          position: "absolute",
        }}
      >
        <AuthOverlay />
        <Sidebar />
        
      </div>
    </MainLayout>
  )
}

export default Home
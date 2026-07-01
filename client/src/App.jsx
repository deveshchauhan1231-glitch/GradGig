// App.jsx
import { Routes, Route } from "react-router-dom"
import Home from "./pages/home"
import About from "./pages/about"
import FindGig from "./pages/findGig"
import Postgigs from "./pages/postGigs"
import BrowseProfiles from "./pages/browseProfiles"
import StudentProfile from "./pages/student_profile"
import Team from "./pages/team"
import Help from "./pages/help"
import NotFound from "./pages/NotFound"
import ProjectDetail from "./pages/projectDetail"
import History from "./pages/history"
import ProjectHistory from "./pages/projectHistory"
import ProposalHistory from "./pages/proposalHistory"
import ContractHistory from "./pages/contractHistory"
import HistoryDetail from "./pages/historyDetail"
import ChatPage from "./pages/chatPage"
import ProfileViewDetailed from "./pages/profile_view"


function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/find-gig" element={<FindGig />} />
      <Route path="/post-gig" element={<Postgigs />} />
      <Route path="/browse-profiles" element={<BrowseProfiles />} />
      <Route path="/student-profile" element={<StudentProfile />} />
      <Route path="/team" element={<Team />} />
      <Route path="/help" element={<Help />} />
      <Route path="/project/:id" element={<ProjectDetail />} />
      <Route path="/history" element={<History />} />
      <Route path="/history/projects" element={<ProjectHistory />} />
      <Route path="/history/proposals" element={<ProposalHistory />} />
      <Route path="/history/contracts" element={<ContractHistory />} />
      <Route path="/history/:type/:scope/:id" element={<HistoryDetail />} />
      <Route path="/chats" element={<ChatPage />} />
      <Route path="/chats/:conversationId" element={<ChatPage />} />
      <Route path="/profile-view/:id" element={<ProfileViewDetailed />} />

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App

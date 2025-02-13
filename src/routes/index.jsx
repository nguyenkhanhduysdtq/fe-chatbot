import ChatPageSocket from "../components/pages/check/ChatPageSocket"
import ContentRight from "../components/pages/login/content-right/ContentRight"
import Homepage from "../components/pages/homepage/Homepage"
import HomepageClient from "../components/pages/Dewi-1.0.0"
import ChatPage from "../components/pages/chat/ChatPage"

//publish router
const publicRoutes = [
    { path: '/', component: HomepageClient, layout: 3 },
    { path: '/chat-socket', component: ChatPageSocket, layout: 1 },
    { path: '/admin', component: Homepage, layout: 2 },
    { path: '/login', component: ContentRight, layout: null },
    { path: '/chat', component: ChatPage, layout: 3 },


]

const privateRoutes = [

]



export { publicRoutes, privateRoutes }
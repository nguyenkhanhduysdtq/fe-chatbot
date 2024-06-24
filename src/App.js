import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { publicRoutes } from "./routes";
import DefaultLayout from "./layout/DefaultLayout/DefaultLayout";
import { Fragment } from "react";



function App() {
  return (

    <Router>
      <div className="App">
        <Routes>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            let Layout;
            if (route.layout === null) {
              Layout = DefaultLayout;
            } else {
              Layout = Fragment;
            }
            return <Route key={index} path={route.path} element={
              <Layout>
                <Page />
              </Layout>
            } />

          })}
        </Routes>

      </div>
    </ Router>

  );
}

export default App;

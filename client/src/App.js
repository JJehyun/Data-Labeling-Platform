import React, { Component, Fragment, Suspense } from 'react';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import { Spin } from 'antd';
import PrivateRoute from './route/privateRoute';
import SuperVisorRoute from './route/superVisorRoute';
import AdminRoute from './route/adminRoute';

import LabelHome from './label/LabelHome';
import LabelingLoader from './label/LabelingLoader';
import OverScreen from './label/OverScreen';
import AdminApp from './admin/AdminApp';
import Help from './help/Help';
import Login from './pages/Login/Login';
import Join from './pages/Login/Join';
import FindIdPw from './pages/Login/FindIdPw';
import WorkHome from './pages/WorkHome/WorkHome';
import InspectionPage from './pages/InspectionPage';

/* 작업자 마이페이지 */
import UserMyPage from './pages/UserMyPage/MyHome';
import ActiveWorks from './pages/UserMyPage/ActiveWorks';
import HistoryQnA from './pages/UserMyPage/HistoryQnA';
import HistoryPoint from './pages/UserMyPage/HistoryPoint';
import HistoryProfits from './pages/UserMyPage/HistoryProfits';
import UserProfile from './pages/UserMyPage/UserProfile';
import ProceedsAccount from './pages/UserMyPage/ProceedsAccount';
import adminMyPage from './pages/AdminMyPage/AdminMyHome';
import WorksAskList from './pages/AdminMyPage/WorksAskLisk';
import UserManager from './pages/AdminMyPage/ManageUser';
import SuperVisorPage from './pages/SupervisorPage';

class App extends Component {
  render() {
    if (process.env.REACT_APP_DEMO) {
      const props = {
        match: {
          params: {
            projectId: 'demo',
            imageId: 1,
          },
        },
        history: {
          replace: () => {},
          push: () => {},
          goBack: () => {},
        },
      };
      return <LabelingLoader {...props} />;
    }
    return (
      <Suspense
        fallback={
          <Spin
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
            }}
            size="large"
          />
        }
      >
        <Fragment>
          <Switch>
            <PrivateRoute exact path="/" component={WorkHome} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/join" component={Join} />
            <Route exact path="/findIdPw" component={FindIdPw} />
            {/* 작업자 마이페이지 */}
            <PrivateRoute exact path="/userMyPage" component={UserMyPage} />
            <PrivateRoute exact path="/activeWorks" component={ActiveWorks} />
            <PrivateRoute exact path="/historyQnA" component={HistoryQnA} />
            <PrivateRoute exact path="/historyPoint" component={HistoryPoint} />
            <PrivateRoute
              exact
              path="/historyProfits"
              component={HistoryProfits}
            />
            <PrivateRoute exact path="/userProfile" component={UserProfile} />
            <PrivateRoute
              exact
              path="/proceedsAccount"
              component={ProceedsAccount}
            />

            <AdminRoute exact path="/inspection" component={InspectionPage} />
            <AdminRoute exact path="/adminMyPage" component={adminMyPage} />
            <AdminRoute exact path="/WorksAskList" component={WorksAskList} />
            <AdminRoute exact path="/UserManager" component={UserManager} />
            <SuperVisorRoute
              exact
              path="/supervisor"
              component={SuperVisorPage}
            />

            <PrivateRoute path="/admin" component={AdminApp} />
            <PrivateRoute path="/help" component={Help} />
            <PrivateRoute
              exact
              path="/label/:projectId"
              component={LabelingLoader}
            />
            <PrivateRoute
              exact
              path="/label/:projectId/:imageId"
              render={(props) =>
                props.match.params.imageId === 'over' ? (
                  <OverScreen {...props} />
                ) : (
                  <LabelingLoader {...props} />
                )
              }
            />
          </Switch>
        </Fragment>
      </Suspense>
    );
  }
}

export default App;

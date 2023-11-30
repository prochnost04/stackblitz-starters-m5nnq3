import React from 'react';
import './style.css';

export default function App() {
  const [resourceLinks, setResourceLinks] = React.useState([]);

  // move these to env variables
  const USERNAME = 'adcat@hdfclife.com';
  const USERPASSWORD = 'Charity@243';
  const APPID = '2d58cdca715651537c0dac5ffc0daac28';

  const getAuthToken = async () => {
    try {
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userName: USERNAME,
          password: USERPASSWORD,
          applicationId: APPID,
        }),
      };

      let response = await fetch(
        'https://api-in.kommunicate.io/login?loginType=email',
        requestOptions
      );
      response = await response.json();
      return response.result.applozicUser.authToken;
    } catch (e) {
      throw new Error('Unable to authorize user. Error => ' + e);
    }
  };
  const getResourceLinks = async () => {
    try {
      const authToken = await getAuthToken();
      let requestOptions = {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Application-Key': APPID,
          'X-Authorization': authToken,
        },
      };

      let response = await fetch(
        'https://chat-in.kommunicate.io/rest/ws/analyst/metabase-report/view',
        requestOptions
      );

      response = await response.json();
      return response.resources;
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  React.useEffect(() => {
    getResourceLinks().then((links) => {
      setResourceLinks(links);
    });
  }, []);
  return (
    <div>
      {resourceLinks.map((each, i) => (
        <iframe
          key={`dashboard-${i}`}
          src={each}
          className={`metabase-dashboard`}
          allowtransparency
        />
      ))}
    </div>
  );
}

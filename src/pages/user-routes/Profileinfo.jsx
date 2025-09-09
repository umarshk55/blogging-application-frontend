// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';
// import { Button, Card, CardBody, CardFooter, Col, Container, Input, Row, Table } from 'reactstrap';
// import Base from '../../components/Base';
// import ViewUserProfile from '../../components/ViewUserProfile';
// import { getUser, updateUser } from '../../services/user-service';
// import { toast } from 'react-toastify';

// function ProfileInfo() {
//     const { userId } = useParams();
//     const [user, setUser] = useState(null);
//     const [updateFlag, setUpdateFlag] = useState(false);
//     const [editUser, setEditUser] = useState({ name: '', about: '' });

//     // Load user data
//     useEffect(() => {
//     getUser(userId)
//         .then(data => {
//             setUser(data);
//             setEditUser({
//                 id: data.id,
//                 name: data.name,
//                 email: data.email,
//                 about: data.about,
//                 roles: data.roles
//             });
//         })
//         .catch(err => console.error("Error fetching user:", err));
//     }, [userId]);


//     // Toggle update form
//     const showUpdateProfile = () => setUpdateFlag(true);
//     const hideUpdateProfile = () => setUpdateFlag(false);

//     // Handle input changes
//     const handleChange = (event, field) => {
//         setEditUser({ ...editUser, [field]: event.target.value });
//     };

//     // Submit updated info
//     const submitUpdate = () => {
//         if (!editUser.name.trim()) {
//             toast.error('Name cannot be empty');
//         return;
//     }

//     const updatedUser = {
//     ...user,                // existing fields (id, email, roles, password, etc.)
//     name: editUser.name,
//     about: editUser.about
//     };

//     updateUser(userId, updatedUser)
//     .then(() => {
//         toast.success('Profile updated successfully!');
//         setUser(updatedUser);
//         hideUpdateProfile();
//     })
//     .catch(err => {
//         console.error("Error updating profile:", err.response?.data || err);
//         toast.error('Error updating profile');
//     });
// };



//     // Update form
//     const updateUserProfileForm = () => (
//         <Card className="mt-2 border-0 rounded-0 shadow-sm">
//             <CardBody>
//                 <h3 className="text-uppercase text-center">Update User Information</h3>
//                 <Container className="text-center">
//                     <img
//                         style={{ maxWidth: '200px', maxHeight: '200px' }}
//                         src={user?.image ?? 'https://cdn.dribbble.com/users/6142/screenshots/5679189/media/1b96ad1f07feee81fa83c877a1e350ce.png?compress=1&resize=400x300&vertical=top'}
//                         alt={user?.name ? `Profile of ${user.name}` : "User profile"}
//                         className="img-fluid rounded-circle"
//                     />
//                 </Container>
//                 <Table responsive striped hover bordered className="text-center mt-5">
//                     <tbody>
//                         <tr>
//                             <td>SHAIK BLOGS ID</td>
//                             <td>SHAIK {user?.id}</td>
//                         </tr>
//                         <tr>
//                             <td>USER NAME</td>
//                             <td>
//                                 <Input type="text" value={editUser.name} onChange={e => handleChange(e, 'name')} />
//                             </td>
//                         </tr>
//                         <tr>
//                             <td>USER EMAIL</td>
//                             <td>{user?.email}</td>
//                         </tr>
//                         <tr>
//                             <td>ABOUT</td>
//                             <td>
//                                 <Input type="textarea" value={editUser.about} onChange={e => handleChange(e, 'about')} />
//                             </td>
//                         </tr>
//                         <tr>
//                             <td>ROLE</td>
//                             <td>{user?.roles?.map(role => <div key={role.id}>{role.name}</div>)}</td>
//                         </tr>
//                     </tbody>
//                 </Table>
//             </CardBody>
//             <CardFooter className="text-center">
//                 <Button color="success" onClick={submitUpdate}>Save Changes</Button>
//                 <Button color="secondary" className="ms-2" onClick={hideUpdateProfile}>Cancel</Button>
//             </CardFooter>
//         </Card>
//     );

//     return (
//         <Base>
//             <Row>
//                 <Col md={{ size: 6, offset: 3 }}>
//                     <Container>
//                         {updateFlag
//                             ? updateUserProfileForm()
//                             : (user
//                                 ? <ViewUserProfile user={user} updateProfileClick={showUpdateProfile} />
//                                 : 'Loading user data...')}
//                     </Container>
//                 </Col>
//             </Row>
//         </Base>
//     );
// }

// export default ProfileInfo;


import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Card, CardBody, CardFooter, Col, Container, Input, Row, Table } from 'reactstrap';
import Base from '../../components/Base';
import ViewUserProfile from '../../components/ViewUserProfile';
import { getUser, updateUser, uploadProfileImage } from '../../services/user-service';
import { toast } from 'react-toastify';

function ProfileInfo() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [updateFlag, setUpdateFlag] = useState(false);
  const [editUser, setEditUser] = useState({ name: '', about: '' });
  const [avatar, setAvatar] = useState(null);

  useEffect(() => {
    getUser(userId)
      .then(data => {
        setUser(data);
        setEditUser({
          name: data.name,
          about: data.about,
        });
      })
      .catch(err => console.error("Error fetching user:", err));
  }, [userId]);

  const showUpdateProfile = () => setUpdateFlag(true);
  const hideUpdateProfile = () => setUpdateFlag(false);

  const handleChange = (e, field) => setEditUser({ ...editUser, [field]: e.target.value });
  const handleFile = (e) => setAvatar(e.target.files?.[0] || null);

  const submitUpdate = async () => {
    if (!editUser.name.trim()) {
      toast.error('Name cannot be empty');
      return;
    }
    try {
      const updatedUser = { ...user, name: editUser.name, about: editUser.about };
      await updateUser(userId, updatedUser);
      if (avatar) {
        await uploadProfileImage(userId, avatar);
      }
      toast.success('Profile updated successfully!');
      setUser(updatedUser);
      setAvatar(null);
      hideUpdateProfile();
    } catch (err) {
      console.error("Error updating profile:", err?.response?.data || err);
      toast.error('Error updating profile');
    }
  };

  const updateUserProfileForm = () => (
    <Card className="mt-2 border-0 rounded-0 shadow-sm">
      <CardBody>
        <h3 className="text-uppercase text-center">Update User Information</h3>
        <Container className="text-center">
          <img
            style={{ maxWidth: '200px', maxHeight: '200px' }}
            src={user?.image ?? 'https://cdn.dribbble.com/users/6142/screenshots/5679189/media/1b96ad1f07feee81fa83c877a1e350ce.png?compress=1&resize=400x300&vertical=top'}
            alt={user?.name ? `Profile of ${user.name}` : "User profile"}
            className="img-fluid rounded-circle"
          />
        </Container>

        <Table responsive striped hover bordered className="text-center mt-5">
          <tbody>
            <tr>
              <td>SHAIK BLOGS ID</td>
              <td>SHAIK {user?.id}</td>
            </tr>
            <tr>
              <td>USER NAME</td>
              <td>
                <Input type="text" value={editUser.name} onChange={(e) => handleChange(e, 'name')} />
              </td>
            </tr>
            <tr>
              <td>USER EMAIL</td>
              <td>{user?.email}</td>
            </tr>
            <tr>
              <td>ABOUT</td>
              <td>
                <Input type="textarea" value={editUser.about} onChange={(e) => handleChange(e, 'about')} />
              </td>
            </tr>
            <tr>
              <td>PROFILE IMAGE</td>
              <td>
                <Input type="file" onChange={handleFile} />
              </td>
            </tr>
            <tr>
              <td>ROLE</td>
              <td>{user?.roles?.map(role => <div key={role.id}>{role.name}</div>)}</td>
            </tr>
          </tbody>
        </Table>
      </CardBody>
      <CardFooter className="text-center">
        <Button color="success" onClick={submitUpdate}>Save Changes</Button>
        <Button color="secondary" className="ms-2" onClick={hideUpdateProfile}>Cancel</Button>
      </CardFooter>
    </Card>
  );

  return (
    <Base>
      <Row>
        <Col md={{ size: 6, offset: 3 }}>
          <Container>
            {updateFlag
              ? updateUserProfileForm()
              : (user
                  ? <ViewUserProfile user={user} updateProfileClick={showUpdateProfile} />
                  : 'Loading user data...')}
          </Container>
        </Col>
      </Row>
    </Base>
  );
}

export default ProfileInfo;

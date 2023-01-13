import Github from "../assets/github_icon.png"
import UploadFileIcon from "../assets/cloud-upload-regular-240.png"
import styled from 'styled-components';
import About from "../assets/quesion.png"
import DashboardIcon from "../assets/dashboard-icon.png"
const iconWidth = "32px"

export const links = [
    { name : "Github", icon : <img style={{width : iconWidth}} src={Github} />},
    { name : "About", icon : <img style={{width : iconWidth}} src={About} />},
]

export const pageLinks = [
    { name : "Upload", icon : <img style={{width : iconWidth}} src={UploadFileIcon} destination={"/upload"} />},
    { name : "Dashboard", icon : <img style={{width : iconWidth}} src={DashboardIcon} destination={"/"} />},
]

export const SiteTitle = styled.h2`
  /* global 94%+ browsers support */
  background: linear-gradient(
    90deg,
    rgba(0, 255, 235, 1) 0%,
    rgba(7, 58, 187, 1) 100%
  );
  -webkit-text-fill-color: transparent;
  -webkit-background-clip: text;
  background-clip: text;
  font-size: 2rem;
  font-weight: 700;
`
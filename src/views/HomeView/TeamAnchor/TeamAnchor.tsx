import "./TeamAnchor.scss";
import { Ref, forwardRef } from "react";
import AnchorSection from "../../../layouts/AnchorSection/AnchorSection";
import teamProfiles from "../../../data/teamProfiles.json";
import ImageWrapper from "../../../components/ImageWrapper/ImageWrapper";

const TeamAnchor = forwardRef(({}, ref: Ref<HTMLDivElement>) => {
  return (
    <AnchorSection ref={ref} id="team" className="anchor" header={"Meet the founders"}>
      <h2 className="TeamAnchor__subtitle">
        30+ years in <b>music</b>, <b>audio</b>, and <b>AI</b>.
      </h2>
      <div className="team-profiles">
        {teamProfiles.map((info) => (
          <div key={info.name} className="profile">
            <ImageWrapper className="profile-photo" src={info.image} alt={`${info.name}-headshot`} />
            <a target="_blank" rel="noreferrer" href={info.url} className="profile-network">
              <h2 className="profile-name">{info.name}</h2>
            </a>
            {/* <h3 className="profile-role">{info.role}</h3> */}
          </div>
        ))}
      </div>
      <h1 className="TeamAnchor__footer">connecting people to their creativity</h1>
    </AnchorSection>
  );
});

export default TeamAnchor;

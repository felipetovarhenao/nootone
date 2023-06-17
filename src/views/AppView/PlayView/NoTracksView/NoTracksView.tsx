import "./NoTracksView.scss";
import { useNavigate } from "react-router";
import Icon from "../../../../components/Icon/Icon";

const NoTracksView = () => {
  const navigate = useNavigate();
  return (
    <div className="NoTracksView">
      <Icon className="NoTracksView__icon" icon="academicons:ideas-repec" />
      <div className="NoTracksView__text">
        <p>Looks like you haven't recorded anything yet!</p>
        <p>
          To start,{" "}
          <span className="NoTracksView__text__link" onClick={() => navigate("/app/")}>
            record an idea
          </span>
          <Icon className="NoTracksView__text__icon" icon="fluent:music-note-1-20-filled" />
        </p>
      </div>
    </div>
  );
};

export default NoTracksView;

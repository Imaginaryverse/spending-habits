import SentimentVeryDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentVeryDissatisfiedOutlined";
import SentimentDissatisfiedOutlinedIcon from "@mui/icons-material/SentimentDissatisfiedOutlined";
import SentimentNeutralOutlinedIcon from "@mui/icons-material/SentimentNeutralOutlined";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import SentimentVerySatisfiedIcon from "@mui/icons-material/SentimentVerySatisfied";

type SentimentIconProps = {
  percentage: number;
};

export function SentimentIcon({ percentage }: SentimentIconProps) {
  if (percentage >= 75) {
    return <SentimentVerySatisfiedIcon fontSize="small" sx={{ mr: 0.5 }} />;
  }

  if (percentage >= 50) {
    return <SentimentSatisfiedAltIcon fontSize="small" sx={{ mr: 0.5 }} />;
  }

  if (percentage >= 25) {
    return <SentimentNeutralOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />;
  }

  if (percentage > 0) {
    return (
      <SentimentDissatisfiedOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
    );
  }

  return (
    <SentimentVeryDissatisfiedOutlinedIcon fontSize="small" sx={{ mr: 0.5 }} />
  );
}

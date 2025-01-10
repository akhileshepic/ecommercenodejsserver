import { mongoose } from "mongoose";
const HomeSliderSchema = new mongoose.Schema({
    image: {
        type: String,

    },
    createdAt: {
        type: Date,
        default: Date.now, // Automatically sets the current date and time
    },
});

const HomeSlider = mongoose.model("HomeSlider", HomeSliderSchema);
export default HomeSlider;
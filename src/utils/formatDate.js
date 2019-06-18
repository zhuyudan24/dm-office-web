import { date } from "index";

export default function (value, format) {
	if (!value) return "";
	value = date.getdate(value, format);
	return value;
};

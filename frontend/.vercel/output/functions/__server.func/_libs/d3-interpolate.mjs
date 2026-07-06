import { i as value_default } from "./@xyflow/react+[...].mjs";
//#region node_modules/d3-interpolate/src/round.js
function round_default(a, b) {
	return a = +a, b = +b, function(t) {
		return Math.round(a * (1 - t) + b * t);
	};
}
//#endregion
//#region node_modules/d3-interpolate/src/piecewise.js
function piecewise(interpolate, values) {
	if (values === void 0) values = interpolate, interpolate = value_default;
	var i = 0, n = values.length - 1, v = values[0], I = new Array(n < 0 ? 0 : n);
	while (i < n) I[i] = interpolate(v, v = values[++i]);
	return function(t) {
		var i = Math.max(0, Math.min(n - 1, Math.floor(t *= n)));
		return I[i](t - i);
	};
}
//#endregion
export { round_default as n, piecewise as t };

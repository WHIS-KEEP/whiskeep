package com.whiskeep.common.formatter;

import java.math.BigDecimal;
import java.math.RoundingMode;

public class ScoreFormatter {

	// 소수점 둘째 자리에서 반올림
	public static Double round(Double value) {
		if (value == null) {
			return null;
		}
		return BigDecimal.valueOf(value).setScale(1, RoundingMode.HALF_UP).doubleValue();
	}
}

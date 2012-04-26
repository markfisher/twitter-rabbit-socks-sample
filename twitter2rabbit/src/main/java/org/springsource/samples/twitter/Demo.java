package org.springsource.samples.twitter;

import org.springframework.context.support.ClassPathXmlApplicationContext;

public class Demo {
	public static void main(String[] args) {
		new ClassPathXmlApplicationContext("context.xml", Demo.class);
	}
}

package JIN.toy.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class HomeController {

    @GetMapping("")
    public String index() {
        System.out.println("홈페이지");
        return "index";
    }
}

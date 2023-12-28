package JIN.toy.controller;

import JIN.toy.dto.MemberDTO;
import JIN.toy.entity.MemberEntity;
import JIN.toy.service.MemberService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;

@RestController
@RequiredArgsConstructor
public class MemberController {

    // 생성자 주입
    private final MemberService memberService;

    @GetMapping("/api/hello")
    public String test() {
        return "Hello, world!";
    }

    @GetMapping("/api/members")
    public List<MemberEntity> member() {
        List<MemberEntity> findMembers = memberService.findAll();
        return findMembers;
    }

    @PostMapping("/api/signup")
    public void save(@RequestBody @Valid MemberDTO memberDTO) {
        memberService.save(memberDTO);
    }

}
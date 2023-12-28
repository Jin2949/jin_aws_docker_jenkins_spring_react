package JIN.toy.service;

import JIN.toy.dto.MemberDTO;
import JIN.toy.entity.MemberEntity;
import JIN.toy.repository.MemberRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MemberService {

    private final MemberRepository memberRepository;

    public void save(MemberDTO memberDTO) {
        MemberEntity memberEntity = MemberEntity.toMemberEntity(memberDTO);
        memberRepository.save(memberEntity);
    }

    public List<MemberEntity> findAll() {
        return memberRepository.findAll();
    }
}

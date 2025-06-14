import React, { useState } from "react";
import { useQuery, useMutation } from "@apollo/client";
import { GET_HOME_CONTENT, UPDATE_HOME_CONTENT } from "../../src/lib/graphql";
import { Card, CardContent, CardHeader, CardTitle } from "../../src/components/ui/card";
import { Button } from "../../src/components/ui/button";
import { Input } from "../../src/components/ui/input";
import { Textarea } from "../../src/components/ui/textarea";
import { toast } from "react-hot-toast";

export default function HomeContentManagement() {
  const { data, loading, refetch } = useQuery(GET_HOME_CONTENT);
  const [updateContent] = useMutation(UPDATE_HOME_CONTENT);

  const [serviceDescription, setServiceDescription] = useState("");
  const [faq, setFaq] = useState("");

  const handleUpdateContent = async () => {
    try {
      await updateContent({
        variables: {
          input: {
            serviceDescription,
            faq,
          },
        },
      });
      toast.success("콘텐츠가 업데이트되었습니다.");
      refetch();
    } catch (error) {
      toast.error("콘텐츠 업데이트 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <div>로딩 중...</div>;

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>홈 페이지 콘텐츠 관리</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label htmlFor="service-description" className="block text-sm font-medium text-gray-700">
                서비스 소개
              </label>
              <Textarea id="service-description" value={serviceDescription} onChange={(e) => setServiceDescription(e.target.value)} placeholder="서비스 소개 내용을 입력하세요" />
            </div>
            <div>
              <label htmlFor="faq" className="block text-sm font-medium text-gray-700">
                FAQ
              </label>
              <Textarea id="faq" value={faq} onChange={(e) => setFaq(e.target.value)} placeholder="FAQ 내용을 입력하세요" />
            </div>
            <Button onClick={handleUpdateContent} className="bg-blue-600 hover:bg-blue-700">
              업데이트
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

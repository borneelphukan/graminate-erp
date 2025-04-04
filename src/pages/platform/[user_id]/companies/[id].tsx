import Button from "@/components/ui/Button";
import DropdownLarge from "@/components/ui/Dropdown/DropdownLarge";
import TextArea from "@/components/ui/TextArea";
import TextField from "@/components/ui/TextField";
import PlatformLayout from "@/layout/PlatformLayout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

import { COMPANY_TYPES } from "@/constants/options";

const CompanyDetails = () => {
  const router = useRouter();
  const { user_id, data } = router.query;
  const [company, setCompany] = useState<any | null>(null);

  const [initialCompanyName, setInitialCompanyName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [type, setType] = useState("");

  // Keep initial values for change detection
  const [initialFormData, setInitialFormData] = useState({
    companyName: "",
    ownerName: "",
    email: "",
    phoneNumber: "",
    address: "",
    type: "",
  });

  // Saving state for update request
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (data) {
      try {
        const parsedCompany = JSON.parse(data as string);
        setCompany(parsedCompany);
        const initCompanyName = parsedCompany[1] || "";
        const initOwnerName = parsedCompany[2] || "";
        const initEmail = parsedCompany[3] || "";
        const initPhoneNumber = parsedCompany[4] || "";
        const initAddress = parsedCompany[5] || "";
        const initType = parsedCompany[6] || "";
        setInitialCompanyName(initCompanyName);
        setCompanyName(initCompanyName);
        setOwnerName(initOwnerName);
        setEmail(initEmail);
        setPhoneNumber(initPhoneNumber);
        setAddress(initAddress);
        setType(initType);
        setInitialFormData({
          companyName: initCompanyName,
          ownerName: initOwnerName,
          email: initEmail,
          phoneNumber: initPhoneNumber,
          address: initAddress,
          type: initType,
        });
      } catch (error) {
        console.error("Error parsing company data:", error);
      }
    }
  }, [data]);

  if (!company) return <p>Loading...</p>;

  // Determine if any changes have been made
  const hasChanges =
    companyName !== initialFormData.companyName ||
    ownerName !== initialFormData.ownerName ||
    email !== initialFormData.email ||
    phoneNumber !== initialFormData.phoneNumber ||
    address !== initialFormData.address ||
    type !== initialFormData.type;

  const handleSave = async () => {
    setSaving(true);

    const payload = {
      id: company[0],
      company_name: companyName,
      owner_name: ownerName,
      email: email,
      phone_number: phoneNumber,
      address: address,
      type: type,
    };

    console.log("Sending update request with payload:", payload);

    try {
      const response = await fetch(
        "http://localhost:3001/api/companies/update",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const result = await response.json();
      console.log("Response from API:", result);

      if (response.ok) {
        Swal.fire("Success", "Company updated successfully", "success");
        setCompany(result.company);
        // Update the initial form data to reflect the new saved values
        setInitialFormData({
          companyName,
          ownerName,
          email,
          phoneNumber,
          address,
          type,
        });
      } else {
        Swal.fire("Error", result.error || "Failed to update company", "error");
      }
    } catch (error) {
      console.error("Error updating company:", error);
      Swal.fire(
        "Error",
        "An error occurred while updating the company.",
        "error"
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <PlatformLayout>
      <div className="px-6">
        <Button
          text="Back"
          style="ghost"
          arrow="left"
          onClick={() => router.push(`/platform/${user_id}/crm?view=companies`)}
        />
        <div className="pt-4">
          <h1 className="text-2xl font-bold mb-4">{initialCompanyName}</h1>
          <div className="grid grid-cols-2 gap-4 text-gray-600">
            <TextField
              label="Company Name"
              value={companyName}
              onChange={(val) => setCompanyName(val)}
              width="large"
            />
            <TextField
              label="Owner Name"
              value={ownerName}
              onChange={(val) => setOwnerName(val)}
              width="large"
            />
            <TextField
              label="Email"
              value={email}
              onChange={(val) => setEmail(val)}
              width="large"
            />
            <TextField
              label="Phone Number"
              value={phoneNumber}
              onChange={(val) => setPhoneNumber(val)}
              width="large"
            />
            <TextArea
              label="Address"
              placeholder="Address (optional)"
              value={address}
              onChange={(val: string) => setAddress(val)}
            />
            <DropdownLarge
              items={COMPANY_TYPES}
              selectedItem={type}
              onSelect={(value: string) => setType(value)}
              type="form"
              label="Type"
              width="full"
            />
          </div>
          <div className="flex flex-row mt-6 space-x-4">
            <Button
              text={saving ? "Updating..." : "Update"}
              style="primary"
              onClick={handleSave}
              isDisabled={!hasChanges || saving}
            />
            <Button
              text="Cancel"
              style="secondary"
              onClick={() =>
                router.push(`/platform/${user_id}/crm?view=companies`)
              }
            />
          </div>
        </div>
      </div>
    </PlatformLayout>
  );
};

export default CompanyDetails;

import React, { useEffect, useState } from 'react';
import {
  UserFormDetails as UserProfileController,
  useSession,
  useLanguage,
} from 'ordering-components/native';
import { useForm, Controller } from 'react-hook-form';
import { launchImageLibrary } from 'react-native-image-picker';
import Spinner from 'react-native-loading-spinner-overlay';
import { StyleSheet } from 'react-native';
import { IMAGES } from '../../config/constants';
import { colors } from '../../theme';
import { ToastType, useToast } from '../../providers/ToastProvider';
import { ProfileParams } from '../../types';
import { flatArray } from '../../utils';
import { AddressList } from '../AddressList'
import { LogoutButton } from '../LogoutButton'
import {
  OIcon,
  OIconButton,
  OInput,
  OText,
  OKeyButton,
} from '../../components/shared';
import {
  CenterView,
  UserData,
  Names,
  EditButton,
} from './styles';

const notValidationFields = [
  'coupon',
  'driver_tip',
  'mobile_phone',
  'address',
  'address_notes',
];

const ProfileUI = (props: ProfileParams) => {
  const {
    navigation,
    isEdit,
    formState,
    validationFields,
    showField,
    isRequiredField,
    toggleIsEdit,
    cleanFormState,
    handleChangeInput,
    handleButtonUpdateClick
  } = props;

  const [{ user }] = useSession();
  const [, t] = useLanguage();
  const { showToast } = useToast();
  const { control, handleSubmit, errors, setValue } = useForm();

  const [validationFieldsSorted, setValidationFieldsSorted] = useState([]);

  const onSubmit = (values: any) => {
    if(formState.changes.password && formState.changes.password.length < 8){
      showToast(ToastType.Error, t('VALIDATION_ERROR_PASSWORD_MIN_STRING', 'The Password must be at least 8 characters.').replace('_attribute_', t('PASSWORD', 'Password')).replace('_min_', 8))
      return
    }

    handleButtonUpdateClick(values);
  }

  const sortValidationFields = () => {
    const fields = [
      'name',
      'middle_name',
      'lastname',
      'second_lastname',
      'email'
    ];
    const fieldsSorted = [];
    const validationsFieldsArray = Object.values(
      validationFields.fields?.checkout,
    );

    fields.forEach((f) => {
      validationsFieldsArray.forEach((field: any) => {
        if (f === field.code) {
          fieldsSorted.push(field);
        }
      });
    });

    fieldsSorted.push(
      validationsFieldsArray.filter(
        (field: any) => !fields.includes(field.code),
      ),
    );
    setValidationFieldsSorted(flatArray(fieldsSorted));
  };

  const handleImagePicker = () => {
    launchImageLibrary({ mediaType: 'photo', maxHeight: 200, maxWidth: 200, includeBase64: true }, (response) => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorMessage) {
        console.log('ImagePicker Error: ', response.errorMessage);
        showToast(ToastType.Error, response.errorMessage);
      } else {
        if (response.uri) {
          const url = `data:${response.type};base64,${response.base64}`
          handleButtonUpdateClick(null, true, url);
        } else {
          showToast(ToastType.Error, t('IMAGE_NOT_FOUND', 'Image not found'));
        }
      }
    });
  };

  const handleCancelEdit = () => {
    cleanFormState({ changes: {} });
    toggleIsEdit();
  };

  useEffect(() => {
    if (validationFields?.fields?.checkout) {
      sortValidationFields();
    }
  }, [validationFields?.fields?.checkout]);

  useEffect(() => {
    if (formState.result.result && !formState.loading) {
      if (formState.result?.error) {
        showToast(ToastType.Error, formState.result.result);
      } else {
        showToast(ToastType.Success, t('UPDATE_SUCCESSFULLY', 'Update successfully'));
      }
    }
  }, [formState.result])

  useEffect(() => {
    if (Object.keys(errors).length > 0) {
      // Convert all errors in one string to show in toast provider
      const list = Object.values(errors);
      let stringError = '';
      list.map((item: any, i: number) => {
        stringError +=
          i + 1 === list.length ? `- ${item.message}` : `- ${item.message}\n`;
      });
      showToast(ToastType.Error, stringError);
    }
  }, [errors]);

  return (
    <>
      <LogoutButton />
      <CenterView>
        <OIcon
          url={user?.photo}
          width={100}
          height={100}
          style={{ borderRadius: 12 }}
        />
        <OIconButton
          icon={IMAGES.camera}
          borderColor={colors.clear}
          iconStyle={{ width: 30, height: 30 }}
          style={{ maxWidth: 40 }}
          onClick={() => handleImagePicker()}
        />
      </CenterView>
      <Spinner visible={formState?.loading} />
      {!isEdit ? (
        <UserData>
          <Names>
            <OText space>{user?.name}</OText>
            <OText>{user?.lastname}</OText>
          </Names>
          {(user?.middle_name || user?.second_lastname) && (
            <Names>
              <OText space>{user?.middle_name}</OText>
              <OText>{user?.second_lastname}</OText>
            </Names>
          )}
          <OText>{user?.email}</OText>
          {user?.cellphone && <OText>{user?.cellphone}</OText>}
        </UserData>
      ) : (
          <>
            {validationFieldsSorted.map(
              (field: any) =>
                !notValidationFields.includes(field.code) &&
                showField &&
                showField(field.code) && (
                  <Controller
                    key={field.id}
                    control={control}
                    render={() => (
                      <OInput
                        key={field.id}
                        name={field.code}
                        placeholder={t(field.code.toUpperCase(), field?.name)}
                        borderColor={colors.whiteGray}
                        style={styles.inputbox}
                        onChange={(val: any) => {
                          setValue(field.code, val.target.value)
                          handleChangeInput(val);
                        }}
                        value={user[field.code]}
                      />
                    )}
                    name={field.code}
                    defaultValue={user[field.code]}
                    rules={{
                      required: isRequiredField(field.code)
                        ? t(`VALIDATION_ERROR_${field.code.toUpperCase()}_REQUIRED`, `${field?.name} is required`).replace('_attribute_', t(field?.name, field.code))
                        : null,
                      pattern: {
                        value: field.code === 'email' ? /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i : null,
                        message: field.code === 'email' ? t('INVALID_ERROR_EMAIL', 'Invalid email address').replace('_attribute_', t('EMAIL', 'Email')) : null
                      }
                    }}
                  />
                )
            )}
            <OInput
              name='password'
              isSecured={true}
              placeholder={'Password'}
              icon={IMAGES.lock}
              style={styles.inputbox}
              onChange={(val: any) => {
                handleChangeInput(val)
              }}
            />
          </>
        )}
      {!validationFields.loading && (
        <EditButton>
          {!isEdit ? (
            <OKeyButton
              title="Edit"
              style={{ ...styles.editButton, flex: 0 }}
              onClick={toggleIsEdit}
            />
          ) : (
              <>
                <OKeyButton
                  title="Cancel"
                  style={styles.editButton}
                  onClick={handleCancelEdit}
                />
                {((formState &&
                  Object.keys(formState?.changes).length > 0 &&
                  isEdit) ||
                  formState?.loading) && (
                    <OKeyButton
                      title="Update"
                      onClick={handleSubmit(onSubmit)}
                      style={{ ...styles.editButton, backgroundColor: colors.primary, marginLeft: 8 }}
                    />
                  )}
              </>
            )}
        </EditButton>
      )}
      {user?.id && (
        <AddressList
          nopadding
          isFromProfile
          userId={user.id}
          navigation={navigation}
        />
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dropdown: {
    borderColor: colors.whiteGray,
    height: 50,
    borderRadius: 25,
    marginTop: 16,
  },
  inputbox: {
    marginVertical: 8,
  },
  editButton: {
    borderRadius: 25,
    borderColor: colors.primary,
    backgroundColor: colors.white,
    borderWidth: 2,
    color: colors.primary,
    width: 100,
    height: 50,
    marginVertical: 8,
    flex: 1,
  },
});

export const UserProfileForm = (props: any) => {
  const profileProps = {
    ...props,
    UIComponent: ProfileUI,
  };
  return <UserProfileController {...profileProps} />;
};
